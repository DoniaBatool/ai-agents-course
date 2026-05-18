import { pgTable, text, timestamp, boolean, integer, unique } from "drizzle-orm/pg-core";

// ── Better Auth required tables ────────────────────────────────────────────────

export const user = pgTable("user", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image:         text("image"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
  updatedAt:     timestamp("updated_at").notNull().defaultNow(),
  // Custom student fields
  experienceLevel: text("experience_level"),  // beginner | intermediate | advanced
  pythonLevel:     text("python_level"),       // none | basic | intermediate | advanced
  goal:            text("goal"),               // why they're taking the course
  // Paddle payment fields
  isPaid:                boolean("is_paid").notNull().default(false),
  paddleCustomerId:      text("paddle_customer_id"),
  paddleSubscriptionId:  text("paddle_subscription_id"),
  // Course completion fields
  completedAt:           timestamp("completed_at"),
  certificateId:         text("certificate_id"),
});

export const session = pgTable("session", {
  id:        text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token:     text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId:    text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id:                     text("id").primaryKey(),
  accountId:              text("account_id").notNull(),
  providerId:             text("provider_id").notNull(),
  userId:                 text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken:            text("access_token"),
  refreshToken:           text("refresh_token"),
  idToken:                text("id_token"),
  accessTokenExpiresAt:   timestamp("access_token_expires_at"),
  refreshTokenExpiresAt:  timestamp("refresh_token_expires_at"),
  scope:                  text("scope"),
  password:               text("password"),
  createdAt:              timestamp("created_at").notNull().defaultNow(),
  updatedAt:              timestamp("updated_at").notNull().defaultNow(),
});

// ── Course progress tracking ───────────────────────────────────────────────────
export const userProgress = pgTable("user_progress", {
  id:          text("id").primaryKey(),
  userId:      text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  lessonId:    text("lesson_id").notNull(),   // e.g. "module-1/lesson-1"
  completedAt: timestamp("completed_at").notNull().defaultNow(),
}, (t) => ({
  uniq: unique().on(t.userId, t.lessonId),    // each lesson counted once per user
}));

export const verification = pgTable("verification", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").defaultNow(),
  updatedAt:  timestamp("updated_at").defaultNow(),
});
