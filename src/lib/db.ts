import { PrismaClient } from "../generated/prisma";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Returns a PrismaClient instance.
 * In Cloudflare Workers production, uses @prisma/adapter-d1 with Cloudflare D1 database.
 * In local dev (npm run dev), uses standard PrismaClient with SQLite file:./dev.db.
 */
export function getPrismaClient(): PrismaClient {
  try {
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      if (!(ctx.env as any).__prismaClient) {
        const adapter = new PrismaD1(ctx.env.DB as D1Database);
        (ctx.env as any).__prismaClient = new PrismaClient({ adapter } as any);
      }
      return (ctx.env as any).__prismaClient;
    } else {
      console.log("Cloudflare Context found but no DB binding:", JSON.stringify(Object.keys(ctx?.env || {})));
      if (process.env.NODE_ENV === "production") {
        throw new Error(`DB binding not found in Cloudflare Context. Available env keys: ${Object.keys(ctx?.env || {}).join(", ")}`);
      }
    }
  } catch (e: any) {
    console.error("getCloudflareContext error:", e);
    if (process.env.NODE_ENV === "production" && !globalForPrisma.prisma) {
       throw new Error("Failed to initialize Prisma on Cloudflare: " + e.message);
    }
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "file:./dev.db",
      },
    },
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

/**
 * Dynamic Proxy ensuring getPrismaClient() is evaluated per property/query call inside Cloudflare Worker requests.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient() as any;
    const value = client[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
