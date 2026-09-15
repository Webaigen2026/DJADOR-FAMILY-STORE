import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize() {
        return null;
      },
    }),
  ],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;