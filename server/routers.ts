import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createStoredFile,
  createBoomboxEvent,
  getBoomboxAnalyticsSummary,
  getBoomboxSetting,
  getDb,
  listBoomboxDeviceImages,
  listBoomboxMediaAssets,
  listBoomboxSettings,
  listBoomboxPackages,
  listBoomboxScents,
  listStoredFiles,
  updateBoomboxPackage,
  updateBoomboxScent,
  updateBoomboxDeviceImage,
  updateBoomboxMediaAsset,
  updateBoomboxSetting,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

const packageInput = z.object({
  code: z.string().length(1),
  name: z.string().min(1).max(80),
  oldPrice: z.number().int().nonnegative(),
  price: z.number().int().nonnegative(),
  deviceLabel: z.string().min(1).max(120),
  extrasLabel: z.string().min(1).max(120),
  scentLabel: z.string().min(1).max(160),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  analytics: router({
    track: publicProcedure
      .input(z.object({
        eventName: z.enum(["package_view", "line_click", "package_select"]),
        packageCode: z.string().length(1).optional(),
        deviceColor: z.string().max(120).optional(),
        scentSummary: z.string().max(2000).optional(),
        source: z.string().max(120).optional(),
      }))
      .mutation(async ({ input }) => {
        await createBoomboxEvent(input);
        return { success: true } as const;
      }),
  }),
  files: router({
    list: protectedProcedure.query(({ ctx }) => listStoredFiles(ctx.user.id)),
    upload: protectedProcedure
      .input(z.object({
        filename: z.string().min(1).max(255),
        mimeType: z.string().min(1).max(120),
        size: z.number().int().positive().max(10 * 1024 * 1024),
        data: z.string().min(1).max(14_000_000),
      }))
      .mutation(async ({ ctx, input }) => {
        const fileBuffer = Buffer.from(input.data, "base64");
        if (fileBuffer.byteLength !== input.size) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "ขนาดไฟล์ไม่ตรงกับข้อมูลที่ส่งมา" });
        }
        const safeFilename = input.filename.replace(/[^a-zA-Z0-9ก-๙._-]+/g, "-").slice(0, 180) || "upload";
        const uploaded = await storagePut(`${ctx.user.id}/files/${safeFilename}`, fileBuffer, input.mimeType);
        if (!(await getDb())) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "ยังเชื่อมต่อฐานข้อมูลไม่ได้" });
        await createStoredFile({ ownerId: ctx.user.id, filename: input.filename, mimeType: input.mimeType, size: input.size, fileKey: uploaded.key, url: uploaded.url });
        return uploaded;
      }),
  }),
  boombox: router({
    catalog: publicProcedure.query(async () => ({
      packages: await listBoomboxPackages(),
      scents: await listBoomboxScents(),
      deviceImages: await listBoomboxDeviceImages(),
      media: await listBoomboxMediaAssets(),
      settings: { metaPixelId: (await getBoomboxSetting("metaPixelId"))?.settingValue ?? "" },
    })),
    adminList: adminProcedure.query(async () => ({ packages: await listBoomboxPackages(), scents: await listBoomboxScents(), deviceImages: await listBoomboxDeviceImages(), media: await listBoomboxMediaAssets(), settings: await listBoomboxSettings() })),
    analyticsSummary: adminProcedure.query(() => getBoomboxAnalyticsSummary()),
    updatePackage: adminProcedure.input(packageInput).mutation(async ({ input }) => {
      const { code, ...patch } = input;
      await updateBoomboxPackage(code, patch);
      return { success: true } as const;
    }),
    uploadPackageImage: adminProcedure
      .input(z.object({ code: z.string().length(1), filename: z.string().min(1).max(255), mimeType: z.string().startsWith("image/"), size: z.number().int().positive().max(10 * 1024 * 1024), data: z.string().min(1).max(14_000_000) }))
      .mutation(async ({ ctx, input }) => {
        const fileBuffer = Buffer.from(input.data, "base64");
        if (fileBuffer.byteLength !== input.size) throw new TRPCError({ code: "BAD_REQUEST", message: "ขนาดไฟล์ไม่ตรงกับข้อมูลที่ส่งมา" });
        const safeFilename = input.filename.replace(/[^a-zA-Z0-9ก-๙._-]+/g, "-").slice(0, 160) || "package-image";
        const uploaded = await storagePut(`${ctx.user.id}/boombox-packages/${input.code}-${Date.now()}-${safeFilename}`, fileBuffer, input.mimeType);
        await updateBoomboxPackage(input.code, { imageUrl: uploaded.url, imageKey: uploaded.key });
        return uploaded;
      }),
    uploadDeviceImage: adminProcedure
      .input(z.object({ color: z.string().min(1).max(30), filename: z.string().min(1).max(255), mimeType: z.string().startsWith("image/"), size: z.number().int().positive().max(10 * 1024 * 1024), data: z.string().min(1).max(14_000_000) }))
      .mutation(async ({ ctx, input }) => {
        const fileBuffer = Buffer.from(input.data, "base64");
        if (fileBuffer.byteLength !== input.size) throw new TRPCError({ code: "BAD_REQUEST", message: "ขนาดไฟล์ไม่ตรงกับข้อมูลที่ส่งมา" });
        const safeColor = input.color.replace(/[^a-zA-Z0-9ก-๙]+/g, "-");
        const safeFilename = input.filename.replace(/[^a-zA-Z0-9ก-๙._-]+/g, "-").slice(0, 160) || "device-image";
        const uploaded = await storagePut(`${ctx.user.id}/boombox-devices/${safeColor}-${Date.now()}-${safeFilename}`, fileBuffer, input.mimeType);
        await updateBoomboxDeviceImage(input.color, { imageUrl: uploaded.url, imageKey: uploaded.key });
        return uploaded;
      }),
    uploadMedia: adminProcedure
      .input(z.object({ assetKey: z.string().regex(/^[a-z0-9_-]+$/).max(80), label: z.string().min(1).max(160), filename: z.string().min(1).max(255), mimeType: z.string().regex(/^(image|video)\//), size: z.number().int().positive().max(50 * 1024 * 1024), data: z.string().min(1).max(70_000_000) }))
      .mutation(async ({ ctx, input }) => {
        const fileBuffer = Buffer.from(input.data, "base64");
        if (fileBuffer.byteLength !== input.size) throw new TRPCError({ code: "BAD_REQUEST", message: "ขนาดไฟล์ไม่ตรงกับข้อมูลที่ส่งมา" });
        const safeFilename = input.filename.replace(/[^a-zA-Z0-9ก-๙._-]+/g, "-").slice(0, 180) || "media";
        const uploaded = await storagePut(`${ctx.user.id}/boombox-media/${input.assetKey}-${Date.now()}-${safeFilename}`, fileBuffer, input.mimeType);
        await updateBoomboxMediaAsset({ assetKey: input.assetKey, label: input.label, mimeType: input.mimeType, fileKey: uploaded.key, url: uploaded.url });
        return uploaded;
      }),
    updateSetting: adminProcedure
      .input(z.object({ settingKey: z.literal("metaPixelId"), settingValue: z.string().max(80) }))
      .mutation(async ({ input }) => {
        const normalized = input.settingValue.trim();
        if (normalized && !/^\d{6,30}$/.test(normalized)) throw new TRPCError({ code: "BAD_REQUEST", message: "Meta Pixel ID ต้องเป็นตัวเลข 6–30 หลัก" });
        await updateBoomboxSetting(input.settingKey, normalized);
        return { success: true } as const;
      }),
    updateScent: adminProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().min(1).max(120), category: z.string().min(1).max(60) })).mutation(async ({ input }) => {
      await updateBoomboxScent(input.id, { name: input.name, category: input.category });
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
