import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const productsJsPath = path.join(process.cwd(), 'src', 'data', 'products.js');

const rawDb = fs.readFileSync(dbPath, 'utf-8');
const dbData = JSON.parse(rawDb);

// Curated elegant maternity gown imagery URLs
const MATERNITY_IMAGES = [
    "https://themomstore.in/cdn/shop/files/elegant-wine-maternity-lace-gown-3656588.jpg?v=1782110590&width=1000",
    "https://images.pexels.com/photos/33180676/pexels-photo-33180676.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/31750738/pexels-photo-31750738.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/31750729/pexels-photo-31750729.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://img.perniaspopupshop.com/catalog/product/n/k/NKGC072509_1.jpg?impolicy=detailimageprod",
    "https://wholesalemegamart.com/wp-content/uploads/2026/04/ZSR-3169-KIDS-ETHNIC-WEAR-FOR-GIRLS-WHOLESALE-1.jpeg"
];

const newMaternityItems = [
    { name: "Silver Crystal Diamond Maternity Mermaid Gown", price: 10500, imgIdx: 0 },
    { name: "Black Crystal Cascade Gown", price: 9500, imgIdx: 1 },
    { name: "Black Ruby Cascade Gown", price: 9500, imgIdx: 2 },
    { name: "Inspired by Anne Hathaway's Maternity Gown", price: 10900, imgIdx: 3 },
    { name: "Maternity Gown with One Shoulder Golden Flower Cape", price: 5400, imgIdx: 4 },
    { name: "White Maternity Tail Gown", price: 5660, imgIdx: 5 },
    { name: "Premium Red Maternity Gown with Flower Hand Cape", price: 7999, imgIdx: 6 },
    { name: "Cinnamon Brown Maternity Bodycon", price: 4799, imgIdx: 0 },
    { name: "Powder Blue Maternity Bodycon Gown", price: 4799, imgIdx: 1 },
    { name: "Black Maternity Gown with White Flowers Shoulder Cape", price: 4999, imgIdx: 2 },
    { name: "Maternity Bodycon Mermaid Gown", price: 3500, imgIdx: 3 },
    { name: "Maternity Gown Flower Hand Cape", price: 6890, imgIdx: 4 },
    { name: "Maternity Bow Bodycon Gown", price: 4900, imgIdx: 5 },
    { name: "Black Maternity Gown with Pink Flower Hand Cape", price: 6999, imgIdx: 6 },
    { name: "Maternity Net Gown", price: 7850, imgIdx: 0 },
    { name: "Mustard Yellow Maternity Gown with White Flower Hand Cape", price: 6999, imgIdx: 1 },
    { name: "Bow Maternity Gown", price: 5999, imgIdx: 2 },
    { name: "White Gown with Black Flower Cape", price: 4999, imgIdx: 3 },
    { name: "Black Maternity Gown with Flower Hand Cape", price: 6999, imgIdx: 4 },
];

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

// 1. Remove old maternity products
const nonMaternityProducts = (dbData.products || []).filter((p) => {
    const cat = (p.category || '').toLowerCase();
    const catSlug = (p.categorySlug || '').toLowerCase();
    return cat !== 'maternity' && catSlug !== 'maternity' && cat !== 'maternity-gowns' && catSlug !== 'maternity-gowns';
});

// 2. Generate new maternity product objects
const formattedMaternityProducts = newMaternityItems.map((item, idx) => {
    const slug = slugify(item.name);
    const originalPrice = Math.round(item.price * 1.25);
    const imgUrl = MATERNITY_IMAGES[item.imgIdx % MATERNITY_IMAGES.length];

    return {
        id: `prod-mat-${String(idx + 1).padStart(2, '0')}`,
        slug: slug,
        name: item.name,
        category: "maternity",
        categorySlug: "maternity",
        categoryName: "Maternity",
        subcategory: "maternity-gowns",
        price: item.price,
        originalPrice: originalPrice,
        discount: "20% OFF",
        featured: idx < 6,
        status: "published",
        image: imgUrl,
        images: [imgUrl],
        description: `Bespoke handcrafted ${item.name}. Designed for maternity photoshoots, baby showers, and grand occasions with breathable stretch lining and custom tailoring.`,
        shortDescription: `Bespoke handcrafted ${item.name} tailored for elegance and comfort.`,
        details: [
            "Tailored at Chattarpur Atelier",
            "Custom belly sizing and length adjustment",
            "Dry Clean Only"
        ]
    };
});

// Combine non-maternity products with the 19 new maternity products
dbData.products = [...nonMaternityProducts, ...formattedMaternityProducts];

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
console.log(`Updated db.json: Total products = ${dbData.products.length} (Maternity products = ${formattedMaternityProducts.length})`);

// Sync to products.js
let productsJsContent = fs.readFileSync(productsJsPath, 'utf-8');
const newProductsExport = `export const initialProducts = ${JSON.stringify(dbData.products, null, 4)};`;
const initialProductsRegex = /export const initialProducts = \[\s*[\s\S]*?\n\];/;

if (initialProductsRegex.test(productsJsContent)) {
    productsJsContent = productsJsContent.replace(initialProductsRegex, newProductsExport);
    fs.writeFileSync(productsJsPath, productsJsContent, 'utf-8');
    console.log('Successfully synced initialProducts in src/data/products.js');
} else {
    console.log('Could not find initialProducts pattern in src/data/products.js');
}
