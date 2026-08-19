import fs from 'fs';
import path from 'path';
import { categoriesTaxonomy } from '../src/data/products.js';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

const rawDb = fs.readFileSync(dbPath, 'utf-8');
const dbData = JSON.parse(rawDb);

let products = dbData.products || [];

// Update category taxonomy in DB
dbData.categories = categoriesTaxonomy;

// Helper to determine category & subcategory for each product
function categorizeProduct(p) {
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();

    // 1. Baby Girl Dresses
    if (cat.includes('baby') || name.includes('baby') || name.includes('tulle') || name.includes('frock') || name.includes('chaniya')) {
        let sub = 'gowns';
        if (name.includes('frock')) sub = 'frock';
        if (name.includes('party') || name.includes('velvet')) sub = 'party-wear';
        if (name.includes('lehenga') || name.includes('choli')) sub = 'mini-lehengas';
        return { category: 'baby-girl-dresses', categorySlug: 'baby-girl-dresses', categoryName: 'Baby Girl Dresses', subcategory: sub };
    }

    // 2. Maternity
    if (cat.includes('maternity') || name.includes('maternity') || desc.includes('maternity') || desc.includes('photoshoot gown')) {
        return { category: 'maternity', categorySlug: 'maternity', categoryName: 'Maternity', subcategory: 'maternity-gowns' };
    }

    // 3. Her Bridal Story
    if (name.includes('engagement') || desc.includes('engagement')) {
        let sub = 'engagement-lehenga';
        if (name.includes('gown') || desc.includes('gown')) sub = 'engagement-gown';
        return { category: 'her-bridal-story', categorySlug: 'her-bridal-story', categoryName: 'Her Bridal Story', subcategory: sub };
    }
    if (name.includes('pre-wedding') || desc.includes('pre-wedding')) {
        return { category: 'her-bridal-story', categorySlug: 'her-bridal-story', categoryName: 'Her Bridal Story', subcategory: 'pre-wedding-gown' };
    }

    // 4. Her Big Day
    if (name.includes('haldi') || desc.includes('haldi') || name.includes('saffron')) {
        return { category: 'her-big-day', categorySlug: 'her-big-day', categoryName: 'Her Big Day', subcategory: 'haldi-outfit' };
    }
    if (name.includes('mehendi') || name.includes('mehandi') || desc.includes('mehendi')) {
        return { category: 'her-big-day', categorySlug: 'her-big-day', categoryName: 'Her Big Day', subcategory: 'mehandi-outfit' };
    }
    if (name.includes('sangeet') || desc.includes('sangeet')) {
        return { category: 'her-big-day', categorySlug: 'her-big-day', categoryName: 'Her Big Day', subcategory: 'sangeet-lehenga' };
    }
    if (name.includes('bridal') || desc.includes('bridal lehenga') || (cat.includes('bridal') && name.includes('lehenga'))) {
        return { category: 'her-big-day', categorySlug: 'her-big-day', categoryName: 'Her Big Day', subcategory: 'bridal-lehenga' };
    }
    if (name.includes('reception') || desc.includes('reception')) {
        return { category: 'her-big-day', categorySlug: 'her-big-day', categoryName: 'Her Big Day', subcategory: 'reception-outfit' };
    }
    if (name.includes('saree') || desc.includes('saree')) {
        return { category: 'her-big-day', categorySlug: 'her-big-day', categoryName: 'Her Big Day', subcategory: 'saree' };
    }

    // 5. Her Beginning
    if (name.includes('anarkali') || desc.includes('anarkali')) {
        return { category: 'her-beginning', categorySlug: 'her-beginning', categoryName: 'Her Beginning', subcategory: 'anarkali' };
    }
    if (name.includes('sharara') || desc.includes('sharara')) {
        return { category: 'her-beginning', categorySlug: 'her-beginning', categoryName: 'Her Beginning', subcategory: 'sharara' };
    }
    if (name.includes('pant') || name.includes('palazzo')) {
        return { category: 'her-beginning', categorySlug: 'her-beginning', categoryName: 'Her Beginning', subcategory: 'pant-suit' };
    }
    if (name.includes('bodycon') || name.includes('western') || name.includes('mermaid') || name.includes('draped')) {
        return { category: 'her-beginning', categorySlug: 'her-beginning', categoryName: 'Her Beginning', subcategory: 'bodycon-dresses' };
    }

    // Default for suits / kurtas
    if (cat.includes('suits') || name.includes('suit') || name.includes('kurta')) {
        return { category: 'her-beginning', categorySlug: 'her-beginning', categoryName: 'Her Beginning', subcategory: 'suits' };
    }

    // Default fallback to Her Beginning
    return { category: 'her-beginning', categorySlug: 'her-beginning', categoryName: 'Her Beginning', subcategory: 'suits' };
}

dbData.products = products.map((p) => {
    const cats = categorizeProduct(p);
    return {
        ...p,
        category: cats.category,
        categorySlug: cats.categorySlug,
        categoryName: cats.categoryName,
        subcategory: cats.subcategory,
    };
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
console.log(`Successfully updated ${dbData.products.length} products with category and subcategory tags in data/db.json`);
