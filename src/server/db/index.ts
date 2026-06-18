import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL is required server-side
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
