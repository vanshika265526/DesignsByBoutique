import fs from 'fs';
import path from 'path';
import { initialProducts, initialCategories, initialChapters } from '../src/data/products.js';
import { writeDb, getDbAsync } from '../src/lib/db.js';

async function syncData() {
    console.log("Reading existing db.json...");
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    let dbData = {};
    if (fs.existsSync(dbPath)) {
        dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }

    // Merge categories
    if (!dbData.categories) dbData.categories = [];
    initialCategories.forEach(cat => {
        const idx = dbData.categories.findIndex(c => c.id === cat.id);
        if (idx !== -1) {
            dbData.categories[idx] = cat;
        } else {
            dbData.categories.push(cat);
        }
    });

    // Merge products
    if (!dbData.products) dbData.products = [];
    initialProducts.forEach(prod => {
        const idx = dbData.products.findIndex(p => p.id === prod.id);
        if (idx !== -1) {
            dbData.products[idx] = { ...dbData.products[idx], ...prod };
        } else {
            dbData.products.push(prod);
        }
    });

    // Save to db.json and sync to MongoDB Atlas
    console.log(`Updating db.json with ${dbData.categories.length} categories and ${dbData.products.length} products...`);
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');

    console.log("Calling writeDb to sync with MongoDB Atlas...");
    await writeDb(dbData);
    console.log("✓ Data synchronization complete!");
}

syncData().catch(err => {
    console.error("Sync error:", err);
    process.exit(1);
});
