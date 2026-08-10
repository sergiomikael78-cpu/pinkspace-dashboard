import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

let localDbInstance: ReturnType<typeof drizzleSqlite<typeof schema>> | null = null;

export function getDb() {
  try {
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      if (!(ctx.env as any).__drizzleDb) {
        (ctx.env as any).__drizzleDb = drizzleD1(ctx.env.DB as D1Database, { schema });
      }
      return (ctx.env as any).__drizzleDb;
    }
  } catch (_e) {
    // getCloudflareContext not available
  }

  if (!localDbInstance) {
    let relativeDbPath = "prisma/dev.db";
    if (process.env.DATABASE_URL) {
      relativeDbPath = process.env.DATABASE_URL.replace("file:", "").replace(/^\.\//, "");
    }
    const finalPath = path.resolve(process.cwd(), relativeDbPath);
    const sqlite = new Database(finalPath);
    localDbInstance = drizzleSqlite(sqlite, { schema });
  }

  return localDbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzleD1<typeof schema>>, {
  get(_target, prop) {
    const instance = getDb() as any;
    const value = instance[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
