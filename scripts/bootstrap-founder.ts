import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";

const email = process.env.ONX_FOUNDER_EMAIL;
const password = process.env.ONX_FOUNDER_PASSWORD;
const name = process.env.ONX_FOUNDER_NAME ?? "ONX Founder";

if (!email || !password) {
  throw new Error("ONX_FOUNDER_EMAIL and ONX_FOUNDER_PASSWORD are required");
}

const result = await auth.api.signUpEmail({
  body: {
    email,
    password,
    name,
  },
});

await db
  .update(user)
  .set({ role: "founder" })
  .where(eq(user.id, result.user.id));

console.log(`Founder account ready: ${email}`);
