import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const productsJsPath = path.join(process.cwd(), 'src', 'data', 'products.js');

const rawDb = fs.readFileSync(dbPath, 'utf-8');
const dbData = JSON.parse(rawDb);

let productsJsContent = fs.readFileSync(productsJsPath, 'utf-8');

// Replace categoriesTaxonomy block and initialProducts block if needed
const newProductsExport = `export const initialProducts = ${JSON.stringify(dbData.products, null, 4)};`;

const initialProductsRegex = /export const initialProducts = \[\s*[\s\S]*?\n\];/;

if (initialProductsRegex.test(productsJsContent)) {
    productsJsContent = productsJsContent.replace(initialProductsRegex, newProductsExport);
    fs.writeFileSync(productsJsPath, productsJsContent, 'utf-8');
    console.log('Successfully synced initialProducts in src/data/products.js');
} else {
    console.log('Could not find initialProducts regex pattern in src/data/products.js');
}
