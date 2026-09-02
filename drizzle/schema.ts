import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: varchar("role", { length: 16 }).default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
});

export const classMembers = pgTable("class_members", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  imageUrl: text("image_url"),
  status: varchar("status", { length: 64 }).default("Active").notNull(),
  race: varchar("race", { length: 120 }),
  tagline: varchar("tagline", { length: 220 }),
  hobbies: text("hobbies"),
  goal: text("goal"),
  instagram: varchar("instagram", { length: 120 }),
  instagramVisible: integer("instagram_visible").default(0).notNull(),
  phone: varchar("phone", { length: 64 }),
  phoneVisible: integer("phone_visible").default(0).notNull(),
  hometown: varchar("hometown", { length: 160 }),
  isPublished: integer("is_published").default(1).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const memberGallery = pgTable("member_gallery", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  imageUrl: text("image_url").notNull(),
  mediaType: varchar("media_type", { length: 16 }).default("image").notNull(),
  altText: varchar("alt_text", { length: 220 }),
  isPublished: integer("is_published").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ClassMember = typeof classMembers.$inferSelect;
export type InsertClassMember = typeof classMembers.$inferInsert;
export type MemberGalleryItem = typeof memberGallery.$inferSelect;
export type InsertMemberGalleryItem = typeof memberGallery.$inferInsert;
