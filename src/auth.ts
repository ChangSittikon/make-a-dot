import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Add role to session (custom property)
        // Note: we might need to cast or define types, but in JS/TS without strict type checking on session it works
        // The role is stored on the user model, so we can access it from the user parameter
        session.user.role = (user as any).role || 'USER'
      }
      return session
    },
  },
  session: {
    strategy: "database", // Since we have an adapter, we use database sessions
  },
  secret: process.env.AUTH_SECRET,
})
