import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const publicContext: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("owner CRUD contracts", () => {
  it("protects member create/update/delete behind admin authorization", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.owner.create({ fullName: "", slug: "invalid" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.owner.update({ id: 1, data: { fullName: "Updated" } })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.owner.remove({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("protects gallery add/update/delete behind admin authorization and validates media URLs", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.owner.addGallery({ memberId: 1, imageUrl: "not-a-url", mediaType: "image" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.owner.updateGallery({ id: 1, isPublished: 0 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.owner.removeGallery({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
