import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: { enabled: true },
  trustedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
  user: {
    additionalFields: {
      experienceLevel: { type: "string", required: false },
      pythonLevel:     { type: "string", required: false },
      goal:            { type: "string", required: false },
    },
  },
  advanced: {
    crossSubDomainCookies: { enabled: false },
    cookies: {
      session_token: {
        attributes: {
          sameSite: "none" as const,
          secure:   true,
        },
      },
    },
  },
});
