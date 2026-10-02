import { asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { boomboxDeviceImages, boomboxEvents, boomboxMediaAssets, boomboxPackages, boomboxScents, boomboxSettings, InsertBoomboxEvent, InsertBoomboxPackage, InsertStoredFile, InsertUser, storedFiles, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listStoredFiles(ownerId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  return db
    .select()
    .from(storedFiles)
    .where(eq(storedFiles.ownerId, ownerId))
    .orderBy(desc(storedFiles.createdAt));
}

export async function createStoredFile(file: InsertStoredFile) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  await db.insert(storedFiles).values(file);
}

export async function listBoomboxPackages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boomboxPackages).orderBy(asc(boomboxPackages.sortOrder));
}

export async function listBoomboxScents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boomboxScents).orderBy(asc(boomboxScents.sortOrder)).limit(19);
}

export async function updateBoomboxPackage(code: string, patch: Partial<InsertBoomboxPackage>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(boomboxPackages).set(patch).where(eq(boomboxPackages.code, code));
}

export async function updateBoomboxScent(id: number, patch: { name?: string; category?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(boomboxScents).set(patch).where(eq(boomboxScents.id, id));
}

export async function createBoomboxEvent(event: InsertBoomboxEvent) {
  const db = await getDb();
  if (!db) return;
  await db.insert(boomboxEvents).values(event);
}

export async function listBoomboxDeviceImages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boomboxDeviceImages).orderBy(asc(boomboxDeviceImages.color));
}

export async function updateBoomboxDeviceImage(color: string, patch: { imageUrl: string; imageKey: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(boomboxDeviceImages).values({ color, ...patch }).onDuplicateKeyUpdate({ set: patch });
}

export async function getBoomboxAnalyticsSummary() {
  const db = await getDb();
  if (!db) return { totals: [], packages: [] };
  const totals = await db.select({ eventName: boomboxEvents.eventName, count: sql<number>`count(*)` }).from(boomboxEvents).groupBy(boomboxEvents.eventName);
  const packages = await db.select({
    packageCode: boomboxEvents.packageCode,
    packageViews: sql<number>`sum(case when ${boomboxEvents.eventName} = 'package_view' then 1 else 0 end)`,
    packageSelections: sql<number>`sum(case when ${boomboxEvents.eventName} = 'package_select' then 1 else 0 end)`,
    lineClicks: sql<number>`sum(case when ${boomboxEvents.eventName} = 'line_click' then 1 else 0 end)`,
  }).from(boomboxEvents).where(sql`${boomboxEvents.packageCode} is not null`).groupBy(boomboxEvents.packageCode).orderBy(sql`lineClicks desc`);
  return { totals, packages };
}

export async function listBoomboxMediaAssets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boomboxMediaAssets).orderBy(asc(boomboxMediaAssets.assetKey));
}

export async function updateBoomboxMediaAsset(asset: { assetKey: string; label: string; mimeType: string; fileKey: string; url: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(boomboxMediaAssets).values(asset).onDuplicateKeyUpdate({ set: { label: asset.label, mimeType: asset.mimeType, fileKey: asset.fileKey, url: asset.url } });
}

export async function getBoomboxSetting(settingKey: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(boomboxSettings).where(eq(boomboxSettings.settingKey, settingKey)).limit(1);
  return rows[0];
}

export async function listBoomboxSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(boomboxSettings).orderBy(asc(boomboxSettings.settingKey));
}

export async function updateBoomboxSetting(settingKey: string, settingValue: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(boomboxSettings).values({ settingKey, settingValue }).onDuplicateKeyUpdate({ set: { settingValue } });
}
