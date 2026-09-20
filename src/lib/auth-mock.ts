import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * MOCK AUTHENTICATION SYSTEM
 * 
 * TODO: Replace this with real NextAuth.js or similar session management.
 * For now, this mimics a centralized `getSession()` or `getCurrentUser()`
 * that ensures we do not hardcode user strings in routes.
 */

export async function getCurrentUser() {
  try {
    // We fetch the first user in DB as our "mock logged-in user".
    // If none exists, we create the Visionary User so the system never breaks.
    let user = await prisma.user.findFirst();
    
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
