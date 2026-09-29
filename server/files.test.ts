import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const sampleUser: AuthenticatedUser = {
  id: 1,
  openId: "sample-user",
  email: "sample@example.com",
  name: "Sample User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("files router", () => {
  it("rejects file listing without an authenticated user", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(caller.files.list()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("rejects uploads larger than the supported 10 MB limit", async () => {
    const caller = appRouter.createCaller(createContext(sampleUser));

    await expect(caller.files.upload({
      filename: "large-video.mp4",
      mimeType: "video/mp4",
      size: 10 * 1024 * 1024 + 1,
      data: "AQ==",
    })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });
});
