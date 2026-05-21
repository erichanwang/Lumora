import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";

/**
 * Extend the built-in session and user types to include the role field.
 *
 * NextAuth v5 uses @auth/core/jwt for JWT module augmentation.
 */
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
  }
}

// Demo users - in production, use a database
const demoUsers = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex@lumora.io",
    password: "demo1234",
    role: "Admin",
    image: null,
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    password: "demo1234",
    role: "Editor",
    image: null,
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = demoUsers.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        );

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {      async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
