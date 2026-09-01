import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const userContext = (role: "user" | "admin"): TrpcContext => ({
  user: { id: 7, openId: "member", name: "Member", email: "member@example.com", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("owner access", () => {
  it("rejects non-admin users before reaching database operations", async () => {
    const caller = appRouter.createCaller(userContext("user"));
    await expect(caller.owner.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
