import { prisma } from "@/lib/prisma";

/**
 * MOCK AUTHENTICATION SYSTEM
 * 
 * TODO: Replace this with real NextAuth.js or similar session management.
 * For now, this mimics a centralized `getSession()` or `getCurrentUser()`
 * that ensures we do not hardcode user strings in routes.
 */

export async function getCurrentUser() {
  try {
    // We fetch Makoto if available or the first user in DB as our "mock logged-in user".
    let user = await prisma.user.findFirst({ where: { name: "Makoto" } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Visionary User",
          email: "visionary@makeadot.com",
          role: "ADMIN",
        },
      });
    }

    return user;
  } catch (error) {
    console.error("[getCurrentUser] DB Error:", error);
    return null;
  }
}
