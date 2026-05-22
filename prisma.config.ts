import { defineConfig } from "prisma/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import path from "path"

const dbPath = path.resolve(process.cwd(), "dev.db")

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: `file:${dbPath}`,
  },
  migrate: {
    adapter: () => new PrismaBetterSqlite3({ url: dbPath }),
  },
})
