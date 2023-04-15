import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["info"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const cors = {
    exposedHeaders: "*",
    origin: "http://localhost:3000",
    methods: "GET, PUT, POST, DELETE, UPDATE",
    credentials: true,
};

export default { prisma, cors };
