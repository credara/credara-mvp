import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Use postgres.js for serverless/edge
export const db = drizzle(connectionString, { schema });

export * from "./schema";
