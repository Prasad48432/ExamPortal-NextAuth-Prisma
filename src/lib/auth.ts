import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

import db from "@/lib/db/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

const adapter = PrismaAdapter(db);

function decodeIdToken(id_token: string) {
  if (!id_token) return null;

  const base64Url = id_token.split(".")[1]; // Get payload
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(Buffer.from(base64, "base64").toString());

  return {
    name: payload.name || null,
    image: payload.picture || null,
    email: payload.email || null,
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  secret: process.env.AUTH_SECRET,
  providers: [
    Google,
    Resend({
      from: "onboarding@linkfolio.space",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const googleData = decodeIdToken(account?.id_token || "");

        const existingUser = await db.user.findUnique({
          where: { email: user.email ?? undefined },
        });

        if (existingUser) {
          const existingGoogleAccount = await db.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: "google",
            },
          });

          if (!existingGoogleAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                provider: "google",
                providerAccountId: account.providerAccountId,
                type: "oidc",
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type
                  ? String(account.token_type)
                  : null,
                id_token: account.id_token,
                scope: account.scope,
                session_state: account.session_state
                  ? String(account.session_state)
                  : null,
              },
            });
          }

          if (!existingUser.name || !existingUser.image) {
            await db.user.update({
              where: { id: existingUser.id },
              data: {
                name: googleData?.name || existingUser.name,
                image: googleData?.image || existingUser.image,
              },
            });
          }
        }
      }

      return true;
    },
  },
  pages: {
    verifyRequest: "/linksent",
  },
});
