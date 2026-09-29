import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const storedFiles = mysqlTable("storedFiles", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  size: int("size").notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull().unique(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StoredFile = typeof storedFiles.$inferSelect;
export type InsertStoredFile = typeof storedFiles.$inferInsert;

export const boomboxPackages = mysqlTable("boomboxPackages", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 4 }).notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  oldPrice: int("oldPrice").notNull(),
  price: int("price").notNull(),
  deviceLabel: varchar("deviceLabel", { length: 120 }).notNull(),
  extrasLabel: varchar("extrasLabel", { length: 120 }).notNull(),
  scentLabel: varchar("scentLabel", { length: 160 }).notNull(),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 512 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BoomboxPackage = typeof boomboxPackages.$inferSelect;
export type InsertBoomboxPackage = typeof boomboxPackages.$inferInsert;

export const boomboxScents = mysqlTable("boomboxScents", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BoomboxScent = typeof boomboxScents.$inferSelect;
export type InsertBoomboxScent = typeof boomboxScents.$inferInsert;

export const boomboxEvents = mysqlTable("boomboxEvents", {
  id: int("id").autoincrement().primaryKey(),
  eventName: varchar("eventName", { length: 60 }).notNull(),
  packageCode: varchar("packageCode", { length: 4 }),
  deviceColor: varchar("deviceColor", { length: 120 }),
  scentSummary: text("scentSummary"),
  source: varchar("source", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BoomboxEvent = typeof boomboxEvents.$inferSelect;
export type InsertBoomboxEvent = typeof boomboxEvents.$inferInsert;

export const boomboxDeviceImages = mysqlTable("boomboxDeviceImages", {
  id: int("id").autoincrement().primaryKey(),
  color: varchar("color", { length: 30 }).notNull().unique(),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 512 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BoomboxDeviceImage = typeof boomboxDeviceImages.$inferSelect;
export type InsertBoomboxDeviceImage = typeof boomboxDeviceImages.$inferInsert;

export const boomboxMediaAssets = mysqlTable("boomboxMediaAssets", {
  id: int("id").autoincrement().primaryKey(),
  assetKey: varchar("assetKey", { length: 80 }).notNull().unique(),
  label: varchar("label", { length: 160 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  url: text("url").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BoomboxMediaAsset = typeof boomboxMediaAssets.$inferSelect;
export type InsertBoomboxMediaAsset = typeof boomboxMediaAssets.$inferInsert;

export const boomboxSettings = mysqlTable("boomboxSettings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 80 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BoomboxSetting = typeof boomboxSettings.$inferSelect;
export type InsertBoomboxSetting = typeof boomboxSettings.$inferInsert;
