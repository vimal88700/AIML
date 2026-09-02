import { describe, expect, it, afterEach } from "vitest";
import { appRouter } from "./routers";
import { ADMIN_COOKIE_NAME } from "./adminAuth";
import { createContext } from "./_core/context";
import type { TrpcContext } from "./_core/context";

function context(cookie = ""): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { cookie } } as TrpcContext["req"],
    res: { cookie: () => undefined, clearCookie: () => undefined } as unknown as TrpcContext["res"],
  };
}

describe("auth.login", () => {
  const originalPassword = process.env.ADMIN_PASSWORD;
  const originalDatabaseUrl = process.env.DATABASE_URL;
  afterEach(() => { process.env.ADMIN_PASSWORD = originalPassword; process.env.DATABASE_URL = originalDatabaseUrl; });

  it("rejects a wrong password", async () => {
    process.env.ADMIN_PASSWORD = "correct-password";
    await expect(appRouter.createCaller(context()).auth.login({ password: "wrong-password" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("issues a session cookie that unlocks owner procedures", async () => {
    process.env.ADMIN_PASSWORD = "correct-password";
    process.env.DATABASE_URL = "";
    let token = "";
    const ctx = context();
    ctx.res.cookie = ((name: string, value: string) => { if (name === ADMIN_COOKIE_NAME) token = value; }) as never;
    await expect(appRouter.createCaller(ctx).auth.login({ password: "correct-password" })).resolves.toEqual({ success: true });
    expect(token).toBeTruthy();
    const ownerCtx = await createContext({ req: { protocol: "https", headers: { cookie: `${ADMIN_COOKIE_NAME}=${token}` } } as any, res: {} as any });
    const records = await appRouter.createCaller(ownerCtx).owner.list();
    expect(Array.isArray(records)).toBe(true);
  });
});
