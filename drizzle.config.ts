import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// @ts-ignore
if (typeof process === "undefined" || typeof process.env === "undefined" || !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não encontrada. Certifique-se de que o banco de dados está provisionado.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process?.env?.DATABASE_URL as string,
  },
});