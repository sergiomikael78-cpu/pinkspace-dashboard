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
    let finalPath = path.resolve(process.cwd(), relativeDbPath);

    // If running on Vercel / serverless environment, copy db to writable /tmp
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      try {
        const fs = require("fs");
        const tmpDbPath = path.join("/tmp", "dev.db");
        if (!fs.existsSync(tmpDbPath) && fs.existsSync(finalPath)) {
          fs.copyFileSync(finalPath, tmpDbPath);
        }
        if (fs.existsSync(tmpDbPath)) {
          finalPath = tmpDbPath;
        }
      } catch (err) {
        console.error("Error setting up writable /tmp database for Vercel:", err);
      }
    }

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
