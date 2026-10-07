import { PrismaClient } from '@prisma/client';
import { emitLiveEvent } from './event-bus';

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function createPrismaClient() {
  const baseClient = new PrismaClient();
  return baseClient.$extends({
    query: {
      $allModels: {
        async create({ model, args, query }) {
          const result = await query(args);
          emitLiveEvent({ topic: 'database', op: 'CREATE', id: (result as any)?.id, data: { model } });
          return result;
        },
        async update({ model, args, query }) {
          const result = await query(args);
          emitLiveEvent({ topic: 'database', op: 'UPDATE', id: (result as any)?.id, data: { model } });
          return result;
        },
        async delete({ model, args, query }) {
          const result = await query(args);
          emitLiveEvent({ topic: 'database', op: 'DELETE', id: (result as any)?.id, data: { model } });
          return result;
        },
        async deleteMany({ model, args, query }) {
          const result = await query(args);
          emitLiveEvent({ topic: 'database', op: 'RELOAD', data: { model } });
          return result;
        },
        async updateMany({ model, args, query }) {
          const result = await query(args);
          emitLiveEvent({ topic: 'database', op: 'RELOAD', data: { model } });
          return result;
        }
      }
    }
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
