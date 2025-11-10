import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// This is a bit of a hack to prevent multiple instances of Prisma Client in development.
// In a serverless environment, this isn't an issue, but in development, Next.js can
// create multiple instances of Prisma Client, which can lead to connection pool exhaustion.
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// If we're in development, we check if there's already a Prisma Client instance on the global object.
// If there is, we use it. If not, we create a new one.
// We also extend the Prisma Client with Accelerate to speed up our database queries.
const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

// If we're not in production, we store the Prisma Client instance on the global object.
// This ensures that we reuse the same instance across hot reloads.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
