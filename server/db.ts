import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { InsertUser, users, classMembers, memberGallery, InsertClassMember, InsertMemberGalleryItem } from "../drizzle/schema";

let pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false } });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, name: user.name ?? null, email: user.email ?? null, loginMethod: user.loginMethod ?? null, role: user.role ?? "user", lastSignedIn: user.lastSignedIn ?? new Date() };
  await db.insert(users).values(values).onConflictDoUpdate({ target: users.openId, set: { name: values.name, email: values.email, loginMethod: values.loginMethod, role: values.role, lastSignedIn: values.lastSignedIn, updatedAt: new Date() } });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0];
}

export async function listMembers(includeUnpublished = false) {
  const db = await getDb(); if (!db) return [];
  const conditions = includeUnpublished ? undefined : eq(classMembers.isPublished, 1);
  return db.select().from(classMembers).where(conditions).orderBy(asc(classMembers.sortOrder), asc(classMembers.fullName));
}

export async function getMemberById(id: number, includeUnpublished = false) {
  const db = await getDb(); if (!db) return undefined;
  const condition = includeUnpublished ? eq(classMembers.id, id) : and(eq(classMembers.id, id), eq(classMembers.isPublished, 1));
  const result = await db.select().from(classMembers).where(condition).limit(1); return result[0];
}

export async function createMember(input: InsertClassMember) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const result = await db.insert(classMembers).values(input).returning({ id: classMembers.id });
  return getMemberById(result[0].id, true);
}

export async function updateMember(id: number, input: Partial<InsertClassMember>) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.update(classMembers).set({ ...input, updatedAt: new Date() }).where(eq(classMembers.id, id));
  return getMemberById(id, true);
}

export async function deleteMember(id: number) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.delete(memberGallery).where(eq(memberGallery.memberId, id)); await db.delete(classMembers).where(eq(classMembers.id, id)); return { success: true } as const;
}

export async function listGallery(memberId: number, includeUnpublished = false) {
  const db = await getDb(); if (!db) return [];
  const condition = includeUnpublished ? eq(memberGallery.memberId, memberId) : and(eq(memberGallery.memberId, memberId), eq(memberGallery.isPublished, 1));
  return db.select().from(memberGallery).where(condition).orderBy(asc(memberGallery.createdAt));
}

export async function addGalleryItem(input: InsertMemberGalleryItem) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  const result = await db.insert(memberGallery).values(input).returning({ id: memberGallery.id });
  return db.select().from(memberGallery).where(eq(memberGallery.id, result[0].id)).limit(1);
}

export async function deleteGalleryItem(id: number) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.delete(memberGallery).where(eq(memberGallery.id, id)); return { success: true } as const;
}

export async function updateGalleryItem(id: number, input: Partial<InsertMemberGalleryItem>) {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.update(memberGallery).set(input).where(eq(memberGallery.id, id)); const result = await db.select().from(memberGallery).where(eq(memberGallery.id, id)).limit(1); return result[0];
}
