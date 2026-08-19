import fs from 'fs';
import path from 'path';
import { initialProducts, initialCategories } from '../src/data/products.js';

console.log("=== FINAL VERIFICATION OF BRIDAL LEHENGAS REMOVAL ===");

// 1. Verify initialCategories in src/data/products.js
const bridalCatSrc = initialCategories.find(c => c.id === 'bridal-lehengas');
const gownsLehengasCatSrc = initialCategories.find(c => c.id === 'gowns-lehengas');
const bridalProdsSrc = initialProducts.filter(p => p.category === 'bridal-lehengas');
const gownsLehengasProdsSrc = initialProducts.filter(p => p.category === 'gowns-lehengas');

console.log(`1. src/data/products.js:`);
console.log(`   Bridal Lehengas category exists: ${bridalCatSrc ? '✗ FAIL (Still exists)' : '✓ ABSENT (Successfully removed)'}`);
console.log(`   Bridal Lehengas products count: ${bridalProdsSrc.length} (Expected: 0)`);
console.log(`   Gowns & Lehengas category exists: ${gownsLehengasCatSrc ? `✓ YES (${gownsLehengasCatSrc.name}, order ${gownsLehengasCatSrc.order})` : '✗ FAIL'}`);
console.log(`   Gowns & Lehengas products count: ${gownsLehengasProdsSrc.length} (Expected: 16)`);
console.log(`   Total categories in src/data/products.js: ${initialCategories.length} (Expected: 5)`);

// 2. Verify data/db.json
const dbPath = path.join(process.cwd(), 'data', 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const bridalCatDb = dbData.categories.find(c => c.id === 'bridal-lehengas');
const gownsLehengasCatDb = dbData.categories.find(c => c.id === 'gowns-lehengas');
const bridalProdsDb = dbData.products.filter(p => p.category === 'bridal-lehengas');
const gownsLehengasProdsDb = dbData.products.filter(p => p.category === 'gowns-lehengas');

console.log(`\n2. data/db.json:`);
console.log(`   Bridal Lehengas category in db.json: ${bridalCatDb ? '✗ FAIL (Still exists)' : '✓ ABSENT'}`);
console.log(`   Bridal Lehengas products in db.json: ${bridalProdsDb.length} (Expected: 0)`);
console.log(`   Gowns & Lehengas category in db.json: ${gownsLehengasCatDb ? `✓ YES (${gownsLehengasCatDb.name}, order ${gownsLehengasCatDb.order})` : '✗ FAIL'}`);
console.log(`   Gowns & Lehengas products in db.json: ${gownsLehengasProdsDb.length} (Expected: 16)`);
console.log(`   Total categories in db.json: ${dbData.categories.length} (Expected: 5)`);
console.log(`   Total products in db.json: ${dbData.products.length} (Expected: 59)`);

console.log("\nCategories currently in database:");
dbData.categories.forEach(c => console.log(`  Order ${c.order}: ${c.name} (${c.id})`));

if (!bridalCatSrc && bridalProdsSrc.length === 0 && gownsLehengasProdsSrc.length === 16 && !bridalCatDb && dbData.categories.length === 5) {
    console.log("\n>>> SUCCESS: BRIDAL LEHENGAS REMOVED COMPLETELY, GOWNS & LEHENGAS RETAINED INTACT! <<<");
} else {
    console.error("\n>>> VERIFICATION FAILED! <<<");
    process.exit(1);
}
