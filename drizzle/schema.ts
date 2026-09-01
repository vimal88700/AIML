import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const classMembers = mysqlTable("class_members", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  imageUrl: text("imageUrl"),
  status: varchar("status", { length: 64 }).default("Active").notNull(),
  race: varchar("race", { length: 120 }),
  tagline: varchar("tagline", { length: 220 }),
  hobbies: text("hobbies"),
  goal: text("goal"),
  instagram: varchar("instagram", { length: 120 }),
  instagramVisible: int("instagramVisible").default(0).notNull(),
  phone: varchar("phone", { length: 64 }),
  phoneVisible: int("phoneVisible").default(0).notNull(),
  hometown: varchar("hometown", { length: 160 }),
  isPublished: int("isPublished").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const memberGallery = mysqlTable("member_gallery", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("memberId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  mediaType: mysqlEnum("mediaType", ["image", "video"]).default("image").notNull(),
  altText: varchar("altText", { length: 220 }),
  isPublished: int("isPublished").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ClassMember = typeof classMembers.$inferSelect;
export type InsertClassMember = typeof classMembers.$inferInsert;
export type MemberGalleryItem = typeof memberGallery.$inferSelect;
export type InsertMemberGalleryItem = typeof memberGallery.$inferInsert;

