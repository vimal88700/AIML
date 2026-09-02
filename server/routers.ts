import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { ADMIN_COOKIE_NAME, createAdminToken, passwordsMatch } from "./adminAuth";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { addGalleryItem, createMember, deleteGalleryItem, deleteMember, getMemberById, listGallery, listMembers, updateGalleryItem, updateMember } from "./db";

const memberInput = z.object({
  fullName: z.string().min(1).max(160), slug: z.string().min(1).max(180), imageUrl: z.string().max(1000).optional().nullable(),
  status: z.string().max(64).default("Active"), tagline: z.string().max(220).optional().nullable(), hobbies: z.string().max(2000).optional().nullable(),
  goal: z.string().max(2000).optional().nullable(), instagram: z.string().max(120).optional().nullable(), instagramVisible: z.number().int().min(0).max(1).default(0), phone: z.string().max(64).optional().nullable(),
  phoneVisible: z.number().int().min(0).max(1).default(0), hometown: z.string().max(160).optional().nullable(), isPublished: z.number().int().min(0).max(1).default(1), sortOrder: z.number().int().default(0),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure.input(z.object({ password: z.string().min(1).max(200) })).mutation(async ({ ctx, input }) => { if (!passwordsMatch(input.password)) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid admin password" }); const token = await createAdminToken(); ctx.res.cookie(ADMIN_COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), httpOnly: true, maxAge: 60 * 60 * 24 * 30 }); return { success: true } as const; }),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(ADMIN_COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }),
  }),
  directory: router({
    list: publicProcedure.query(() => listMembers(false)),
    profile: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getMemberById(input.id)),
    gallery: publicProcedure.input(z.object({ memberId: z.number().int().positive() })).query(({ input }) => listGallery(input.memberId)),
  }),
  owner: router({
    list: adminProcedure.query(() => listMembers(true)),
    create: adminProcedure.input(memberInput).mutation(({ input }) => createMember(input)),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), data: memberInput.partial() })).mutation(({ input }) => updateMember(input.id, input.data)),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteMember(input.id)),
    addGallery: adminProcedure.input(z.object({ memberId: z.number().int().positive(), imageUrl: z.string().url().max(1000), mediaType: z.enum(["image", "video"]).default("image"), altText: z.string().max(220).optional().nullable(), isPublished: z.number().int().min(0).max(1).default(1) })).mutation(({ input }) => addGalleryItem(input)),
    removeGallery: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteGalleryItem(input.id)),
    gallery: adminProcedure.input(z.object({ memberId: z.number().int().positive() })).query(({ input }) => listGallery(input.memberId, true)),
    updateGallery: adminProcedure.input(z.object({ id: z.number().int().positive(), isPublished: z.number().int().min(0).max(1).optional(), mediaType: z.enum(["image", "video"]).optional() })).mutation(({ input }) => updateGalleryItem(input.id, { isPublished: input.isPublished, mediaType: input.mediaType })),
  }),
});

export type AppRouter = typeof appRouter;
