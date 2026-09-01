import { eq, asc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, classMembers, memberGallery, InsertClassMember, InsertMemberGalleryItem } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listMembers(includeUnpublished = false) {
  const db = await getDb();
  if (!db) return [];
  const conditions = includeUnpublished ? undefined : eq(classMembers.isPublished, 1);
  return db.select().from(classMembers).where(conditions).orderBy(asc(classMembers.sortOrder), asc(classMembers.fullName));
}

export async function getMemberById(id: number, includeUnpublished = false) {
  const db = await getDb();
  if (!db) return undefined;
  const condition = includeUnpublished ? eq(classMembers.id, id) : and(eq(classMembers.id, id), eq(classMembers.isPublished, 1));
  const result = await db.select().from(classMembers).where(condition).limit(1);
  return result[0];
}

export async function createMember(input: InsertClassMember) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(classMembers).values(input);
  return getMemberById(Number(result[0].insertId), true);
}

export async function updateMember(id: number, input: Partial<InsertClassMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(classMembers).set(input).where(eq(classMembers.id, id));
  return getMemberById(id, true);
}

export async function deleteMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(memberGallery).where(eq(memberGallery.memberId, id));
  await db.delete(classMembers).where(eq(classMembers.id, id));
  return { success: true } as const;
}

export async function listGallery(memberId: number, includeUnpublished = false) {
  const db = await getDb();
  if (!db) return [];
  const condition = includeUnpublished ? eq(memberGallery.memberId, memberId) : and(eq(memberGallery.memberId, memberId), eq(memberGallery.isPublished, 1));
  return db.select().from(memberGallery).where(condition).orderBy(asc(memberGallery.createdAt));
}

export async function addGalleryItem(input: InsertMemberGalleryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(memberGallery).values(input);
  return db.select().from(memberGallery).where(eq(memberGallery.id, Number(result[0].insertId))).limit(1);
}

export async function deleteGalleryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(memberGallery).where(eq(memberGallery.id, id));
  return { success: true } as const;
}

export async function updateGalleryItem(id: number, input: Partial<InsertMemberGalleryItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(memberGallery).set(input).where(eq(memberGallery.id, id));
  const result = await db.select().from(memberGallery).where(eq(memberGallery.id, id)).limit(1);
  return result[0];
}
