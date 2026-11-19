import { randomBytes } from "node:crypto";
import { appendFileSync } from "node:fs";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
if (process.env.AUTH_SECRET) {
  console.log("AUTH_SECRET is already configured.");
} else {
  appendFileSync(".env.local", `\nAUTH_SECRET=${randomBytes(32).toString("base64")}\n`, { mode: 0o600 });
  console.log("Created AUTH_SECRET in .env.local.");
}
