import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { createLineOrderMessage, createLineOrderUrl, LINE_ADD_FRIEND_URL } from "../shared/line";

type ContextOverrides = Partial<TrpcContext>;

function createContext(overrides: ContextOverrides = {}): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
    ...overrides,
  };
}

function adminUser() {
  return {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "BoomBox Admin",
    loginMethod: "manus",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

describe("boombox admin procedures", () => {
  it("uses the exact LINE Official Account add-friend URL", () => {
    expect(LINE_ADD_FRIEND_URL).toBe("https://lin.ee/qczVNTJ");
  });

  it("builds a LINE order URL with the selected package in the preset message", () => {
    const url = createLineOrderUrl({ code: "B", name: "คุ้มค่า", price: "389" });
    expect(url).toBe("https://lin.ee/qczVNTJ");
    expect(createLineOrderMessage({ code: "B", name: "คุ้มค่า", price: "389" })).toContain("แพ็กเกจ B คุ้มค่า ราคา 389 บาท");
  });

  it("includes selected device color and scent boxes in a LINE order URL", () => {
    const url = createLineOrderUrl(
      { code: "B", name: "คุ้มค่า", price: "389" },
      { deviceColors: ["สีดำ"], scents: ["มิ้นท์", "สตรอว์เบอร์รี"], note: "เลือกกลิ่นซ้ำได้" },
    );
    const message = createLineOrderMessage(
      { code: "B", name: "คุ้มค่า", price: "389" },
      { deviceColors: ["สีดำ"], scents: ["มิ้นท์", "สตรอว์เบอร์รี"], note: "เลือกกลิ่นซ้ำได้" },
    );
    expect(message).toContain("สีเครื่อง: สีดำ");
    expect(message).toContain("กล่องที่ 1: มิ้นท์");
    expect(message).toContain("กล่องที่ 2: สตรอว์เบอร์รี");
  });

  it("blocks unauthenticated catalog management", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.boombox.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks regular users from editing packages", async () => {
    const caller = appRouter.createCaller(createContext({ user: { ...adminUser(), role: "user" } }));
    await expect(caller.boombox.updatePackage({
      code: "A",
      name: "ลองเล่น",
      oldPrice: 599,
      price: 299,
      deviceLabel: "เครื่อง",
      extrasLabel: "+100 เม็ด",
      scentLabel: "สุ่มกลิ่น",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects invalid package codes before touching the database", async () => {
    const caller = appRouter.createCaller(createContext({ user: adminUser() }));
    await expect(caller.boombox.updatePackage({
      code: "AB",
      name: "แพ็กเกจผิด",
      oldPrice: 599,
      price: 299,
      deviceLabel: "เครื่อง",
      extrasLabel: "+100 เม็ด",
      scentLabel: "สุ่มกลิ่น",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
