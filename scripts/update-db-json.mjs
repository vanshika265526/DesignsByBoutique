import fs from 'fs';
import path from 'path';
import { initialProducts, initialCategories } from '../src/data/products.js';

const dbPath = path.join(process.cwd(), 'data', 'db.json');
let dbData = {};
if (fs.existsSync(dbPath)) {
    dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

dbData.categories = initialCategories;

if (!dbData.products) dbData.products = [];
initialProducts.forEach(prod => {
    const idx = dbData.products.findIndex(p => p.id === prod.id);
    if (idx !== -1) {
        dbData.products[idx] = { ...dbData.products[idx], ...prod };
    } else {
        dbData.products.push(prod);
    }
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
console.log(`✓ Updated db.json: ${dbData.categories.length} categories, ${dbData.products.length} products.`);
