import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findOrCreateUser } from "@/services/mongo"; 

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const { email, name } = user;

      if (!email) {
        console.error("Email is missing from Google response.");
        return false;
      }

      try {
        const addedUser= await findOrCreateUser({ email, name });
        return addedUser;
      } catch (error) {
        console.error("Error creating user:", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login-user",
  },
});
