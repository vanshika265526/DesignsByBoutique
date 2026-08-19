import fs from 'fs';
import path from 'path';
import { initialProducts, initialCategories } from '../src/data/products.js';

console.log("=== VERIFYING GOWNS & LEHENGAS CATEGORY & PRODUCTS ===");

// 1. Verify in src/data/products.js
const gownCatSrc = initialCategories.find(c => c.id === 'gowns-lehengas');
const gownProdsSrc = initialProducts.filter(p => p.category === 'gowns-lehengas');

console.log(`1. src/data/products.js:`);
console.log(`   Category found: ${gownCatSrc ? `✓ ${gownCatSrc.name} (order ${gownCatSrc.order})` : '✗ NOT FOUND'}`);
console.log(`   Products count: ${gownProdsSrc.length} (Expected: 16)`);

// 2. Verify in data/db.json
const dbPath = path.join(process.cwd(), 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const gownCatDb = dbData.categories.find(c => c.id === 'gowns-lehengas');
const gownProdsDb = dbData.products.filter(p => p.category === 'gowns-lehengas');

console.log(`\n2. data/db.json:`);
console.log(`   Category found: ${gownCatDb ? `✓ ${gownCatDb.name}` : '✗ NOT FOUND'}`);
console.log(`   Products count: ${gownProdsDb.length} (Expected: 16)`);

console.log("\nProducts in category 'gowns-lehengas':");
gownProdsDb.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.id}] ${p.name} - ₹${p.price}`);
});

if (gownCatSrc && gownProdsSrc.length === 16 && gownCatDb && gownProdsDb.length === 16) {
    console.log("\n>>> ALL VERIFICATION CHECKS PASSED! <<<");
} else {
    console.error("\n>>> VERIFICATION FAILED! <<<");
    process.exit(1);
}
