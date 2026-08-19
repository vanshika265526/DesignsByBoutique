import fs from 'fs';
import path from 'path';

console.log("=== REMOVING BRIDAL LEHENGAS CATEGORY & PRODUCTS ===");

const productsJsPath = path.join(process.cwd(), 'src', 'data', 'products.js');
const dbJsonPath = path.join(process.cwd(), 'data', 'db.json');

// 1. Process db.json
let dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

const initialCategoriesCount = dbData.categories.length;
const initialProductsCount = dbData.products.length;

// Filter categories
dbData.categories = dbData.categories
    .filter(c => c.id !== 'bridal-lehengas')
    .map((c, idx) => ({ ...c, order: idx + 1 }));

// Filter products
dbData.products = dbData.products.filter(p => p.category !== 'bridal-lehengas');

fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf-8');
console.log(`✓ Updated db.json: Categories ${initialCategoriesCount} -> ${dbData.categories.length}, Products ${initialProductsCount} -> ${dbData.products.length}`);

// 2. Process products.js
let fileContent = fs.readFileSync(productsJsPath, 'utf-8');

// Regex to remove any product block with category: "bridal-lehengas"
// In products.js, product objects have "category": "bridal-lehengas"
const productBlockRegex = /\s*\{\s*"id":\s*"[^"]+",\s*"slug":\s*"[^"]+",\s*"name":\s*"[^"]+",\s*"category":\s*"bridal-lehengas"[\s\S]*?\},/g;
fileContent = fileContent.replace(productBlockRegex, '');

fs.writeFileSync(productsJsPath, fileContent, 'utf-8');
console.log("✓ Removed bridal-lehengas product blocks from src/data/products.js");
