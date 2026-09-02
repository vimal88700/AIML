import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

const publicContext: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("directory procedures", () => {
  beforeEach(() => { process.env.DATABASE_URL = ""; });
  it("returns a list for the public directory", async () => {
    const result = await appRouter.createCaller(publicContext).directory.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns a safe gallery list for a member", async () => {
    const result = await appRouter.createCaller(publicContext).directory.gallery({ memberId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});
