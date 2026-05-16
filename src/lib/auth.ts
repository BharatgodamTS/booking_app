import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "ADMIN" | "OWNER" | "WAREHOUSE_OWNER" | "CLIENT";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "ADMIN" | "OWNER" | "WAREHOUSE_OWNER" | "CLIENT";
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // 🛡️ EXPLICIT DATABASE QUERY (No Caching)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          throw new Error("AUTHENTICATION_FAILED: Identity not found in registry.");
        }

        // 🛡️ ADMIN APPROVAL GATE
        if (user.approvalStatus === "PENDING") {
          throw new Error("ACCOUNT_PENDING: Verification in progress. Please wait for Admin activation.");
        }
        if (user.approvalStatus === "REJECTED") {
          throw new Error("ACCOUNT_REJECTED: Access denied by administration.");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("AUTHENTICATION_FAILED: Invalid credential pair.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as any,
          approvalStatus: user.approvalStatus
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.approvalStatus = (user as any).approvalStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        (session.user as any).approvalStatus = token.approvalStatus;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Force clean redirects for role-based onboarding
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
