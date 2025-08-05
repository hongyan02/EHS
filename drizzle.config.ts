import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    out: "./drizzle",
    dialect: "mysql",
    dbCredentials: {
        url: "mysql://ed8bu%40%25:Eve_ed_2025@10.22.161.64:3306/ehs",
    },
    verbose: true,
    strict: true,
});
