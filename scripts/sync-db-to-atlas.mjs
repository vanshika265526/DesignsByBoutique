/**
 * One-time / on-demand sync: pushes data/db.json into MongoDB Atlas.
 *
 * WHY: In production (Vercel) the site reads from MongoDB Atlas, not db.json.
 * Editing db.json and pushing code does NOT update Atlas, because the app only
 * seeds a collection when it is empty. This script upserts your db.json records
 * into Atlas by `id`, so the live site shows the same images as localhost.
 *
 * USAGE:
 *   1. Get your production connection string from Vercel:
 *        Vercel dashboard > your project > Settings > Environment Variables > MONGODB_URI
 *   2. Add it to your local .env.local (this file is git-ignored):
 *        MONGODB_URI=mongodb+srv://...your-atlas-uri...
 *        MONGODB_DB=designs_by_nisha        # only if you use a custom db name
 *   3. Run:
 *        node scripts/sync-db-to-atlas.mjs
 *   4. Hard-refresh your Vercel site (Ctrl/Cmd + Shift + R).
 */

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import path from "path";

const root = process.cwd();

// --- Load .env.local manually (no extra dependency) ---
try {
    const envRaw = readFileSync(path.join(root, ".env.local"), "utf-8");
    for (const line of envRaw.split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) {
            process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
        }
    }
} catch {
    /* .env.local is optional if the vars are already in the shell */
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "designs_by_nisha";

if (!uri || uri.includes("127.0.0.1") || uri.includes("localhost")) {
    console.error(
        "\n✗ MONGODB_URI is missing or points at localhost.\n" +
            "  Copy the Atlas connection string from Vercel > Settings > Environment Variables\n" +
            "  and put it in your local .env.local as MONGODB_URI=...\n"
    );
    process.exit(1);
}

const data = JSON.parse(readFileSync(path.join(root, "data", "db.json"), "utf-8"));

// Collections keyed by `id`
const idCollections = [
    "products",
    "categories",
    "chapters",
    "gallery",
    "offers",
    "testimonials",
];

const client = new MongoClient(uri);

try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`\nConnected to Atlas db "${dbName}". Syncing from data/db.json...\n`);

    for (const col of idCollections) {
        const items = Array.isArray(data[col]) ? data[col] : [];
        let count = 0;
        for (const item of items) {
            if (!item || !item.id) continue;
            const { _id, ...rest } = item; // never try to overwrite _id
            await db.collection(col).updateOne(
                { id: item.id },
                { $set: rest },
                { upsert: true }
            );
            count++;
        }
        console.log(`  ✓ ${col.padEnd(13)} ${count} record(s) synced`);
    }

    // Singletons
    if (data.settings) {
        const { _id, ...s } = data.settings;
        await db
            .collection("settings")
            .updateOne({ _id: "boutique_settings" }, { $set: s }, { upsert: true });
        console.log("  ✓ settings      1 record synced");
    }
    if (data.analytics) {
        const { _id, ...a } = data.analytics;
        await db
            .collection("analytics")
            .updateOne({ _id: "boutique_analytics" }, { $set: a }, { upsert: true });
        console.log("  ✓ analytics     1 record synced");
    }

    console.log("\n✓ Done. Hard-refresh your Vercel site to see the updated images.\n");
} catch (err) {
    console.error("\n✗ Sync failed:", err.message, "\n");
    process.exitCode = 1;
} finally {
    await client.close();
}
