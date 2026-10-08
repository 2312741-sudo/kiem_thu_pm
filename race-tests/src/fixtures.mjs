import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { pool, query } from "./db.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sql = fs.readFileSync(path.join(root, "fixtures", "fixtures.sql"), "utf8");

await pool.query(sql);
const rows = await query(
  `SELECT e.id, e.slug, e.length, e."seatsPerTimeSlot" AS seats, e."requiresConfirmation" AS confirm,
          e."bookingLimits" AS limits
     FROM "EventType" e JOIN users u ON u.id = e."userId"
    WHERE u.username = 'k15host' ORDER BY e.id`
);
console.table(rows);
await pool.end();
