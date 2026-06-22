import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// NextAuth (v4) base configuration — email/password via CredentialsProvider.
// The full authentication flow (pages, error handling, registration) is built
// in Phase 02; this is the foundational skeleton.
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as { id?: string }).id = (user as { id?: string }).id;
      }
      // Keep the token in sync with the latest profile data so edits on the
      // profile page (name / e-mail / avatar) show up after a refresh without
      // requiring the user to log in again.
      const id = (token as { id?: string }).id;
      if (id) {
        const fresh = await db.user.findUnique({
          where: { id },
          select: { name: true, email: true, avatar: true },
        });
        if (fresh) {
          token.name = fresh.name;
          token.email = fresh.email;
          token.picture = fresh.avatar ?? null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = (token as { id?: string }).id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
