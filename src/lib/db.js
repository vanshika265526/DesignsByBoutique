import fs from 'fs';
import path from 'path';
import { initialProducts, initialCategories, initialChapters, initialGallery, initialOffers } from '@/data/products';
import { boutiqueConfig } from '@/config/boutique';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

// Helper to construct seed database
function getSeedData() {
    return {
        products: initialProducts,
        categories: initialCategories,
        chapters: initialChapters,
        gallery: initialGallery,
        offers: initialOffers || [
            {
                id: 'offer-1',
                title: 'Festive Bridal Preview Discount',
                code: 'BRIDAL2026',
                discountPercent: 15,
                description: 'Exclusive 15% bespoke discount on all pre-booked Bridal Lehengas.',
                applicableCategory: 'bridal-lehengas',
                active: true,
                startDate: '2026-08-01',
                endDate: '2026-10-31',
            }
        ],
        settings: {
            boutiqueName: boutiqueConfig.name,
            tagline: boutiqueConfig.tagline,
            phone: boutiqueConfig.contact.phone,
            phoneDisplay: boutiqueConfig.contact.phoneDisplay,
            whatsappNumber: boutiqueConfig.whatsapp.number,
            defaultWhatsAppMessage: boutiqueConfig.whatsapp.defaultMessage,
            email: boutiqueConfig.contact.email,
            address: boutiqueConfig.location.address,
            city: boutiqueConfig.location.city,
            state: boutiqueConfig.location.state,
            zip: boutiqueConfig.location.zip,
            country: boutiqueConfig.location.country,
            fullAddress: boutiqueConfig.fullAddress,
            instagramUsername: boutiqueConfig.instagram.handle,
            instagramUrl: boutiqueConfig.instagram.url,
            hours: boutiqueConfig.hours,
            announcementBanner: boutiqueConfig.announcementBanner,
            seoTitle: boutiqueConfig.seo.defaultTitle,
            seoDescription: boutiqueConfig.seo.defaultDescription,
            updatedAt: new Date().toISOString(),
        },
        enquiries: [
            {
                id: 'enq-1',
                name: 'Priya Sharma',
                phone: '+91 98765 43210',
                email: 'priya@example.com',
                productName: 'Royal Velvet Zardozi Lehenga',
                productCategory: 'Bridal Lehengas',
                message: 'Hi, I would like to book a bridal consultation for next month.',
                status: 'New',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
                id: 'enq-2',
                name: 'Ananya Gupta',
                phone: '+91 98111 22334',
                email: 'ananya@example.com',
                productName: 'Rose Gold Silk Maternity Gown',
                productCategory: 'Maternity Gowns',
                message: 'Is this gown available for custom fitting?',
                status: 'Contacted',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            }
        ],
        analytics: {
            totalPageViews: 14850,
            monthlyPageViews: 4230,
            productViews: 8920,
            whatsappClicks: 640,
            callClicks: 215,
            instagramClicks: 1120,
            dailyPageViews: [
                { date: "Aug 01", views: 320, whatsapp: 18, instagram: 35 },
                { date: "Aug 02", views: 410, whatsapp: 24, instagram: 42 },
                { date: "Aug 03", views: 380, whatsapp: 21, instagram: 38 },
                { date: "Aug 04", views: 520, whatsapp: 32, instagram: 55 },
                { date: "Aug 05", views: 490, whatsapp: 28, instagram: 48 },
                { date: "Aug 06", views: 610, whatsapp: 39, instagram: 62 },
                { date: "Aug 07", views: 580, whatsapp: 35, instagram: 58 },
                { date: "Aug 08", views: 640, whatsapp: 41, instagram: 70 },
                { date: "Aug 09", views: 720, whatsapp: 48, instagram: 82 },
                { date: "Aug 10", views: 690, whatsapp: 45, instagram: 75 },
                { date: "Aug 11", views: 810, whatsapp: 54, instagram: 91 },
            ],
            categoryPerformance: [
                { category: "Bridal Lehengas", views: 3450, enquiries: 210, share: "38.6%" },
                { category: "Suits & Anarkalis", views: 2890, enquiries: 165, share: "32.4%" },
                { category: "Haldi & Mehendi", views: 1420, enquiries: 95, share: "15.9%" },
                { category: "Maternity Gowns", views: 780, enquiries: 48, share: "8.7%" },
                { category: "Baby Clothes", views: 380, enquiries: 22, share: "4.4%" },
            ],
            topProducts: [
                { id: "prod-03", name: "Rose Royal Heirloom Bridal Lehenga", views: 1840, contacts: 142, category: "Bridal Lehengas" },
                { id: "prod-01", name: "Gulzar Chanderi Silk Anarkali Set", views: 1420, contacts: 98, category: "Suits & Anarkalis" },
                { id: "prod-05", name: "Emerald Mehendi Embroidered Sharara", views: 980, contacts: 64, category: "Haldi & Mehendi" },
                { id: "prod-04", name: "Kesar Haldi Sunshine Silk Lehenga", views: 870, contacts: 52, category: "Bridal Lehengas" },
                { id: "prod-07", name: "Grace Powder Pink Silk Maternity Gown", views: 650, contacts: 38, category: "Maternity Gowns" },
                { id: "prod-09", name: "Nirmal Miniature Rose Baby Lehenga Set", views: 420, contacts: 24, category: "Baby Clothes" },
            ],
        },
        testimonials: [
            {
                id: "test-1",
                author: "Kavita Malhotra",
                city: "South Extension, New Delhi",
                rating: 5,
                text: "Nisha designed my custom bridal lehenga in just 3 weeks! The hand zardozi work and personal fitting sessions made me feel like royalty on my wedding day.",
                outfit: "Rose Royal Heirloom Bridal Lehenga",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
                featured: true,
            },
            {
                id: "test-2",
                author: "Rhea Singhania",
                city: "Defence Colony, New Delhi",
                rating: 5,
                text: "Her maternity photoshoot gown was beyond magical! Super breathable pure silk and fitted so comfortably during my third trimester.",
                outfit: "Grace Powder Pink Silk Maternity Gown",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
                featured: true,
            },
            {
                id: "test-3",
                author: "Pooja & Sameer Verma",
                city: "Gurugram",
                rating: 5,
                text: "We ordered matching Mommy & Me Haldi lehengas for our daughter's first Diwali. Zero-scratch inner lining made our baby so comfortable!",
                outfit: "Nirmal Miniature Rose Baby Lehenga Set",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
                featured: true,
            },
        ],
        auditLogs: [
            {
                id: 'log-1',
                user: 'Admin',
                action: 'System initialized',
                details: 'Database seeded with default boutique products, categories, analytics, and settings.',
                timestamp: new Date().toISOString()
            }
        ]
    };
}

import { getDatabase } from './mongodb';

// Helper to seed MongoDB Atlas if collection is empty
export async function seedMongoIfEmpty() {
    try {
        const db = await getDatabase();
        const collections = ['products', 'categories', 'chapters', 'gallery', 'offers', 'enquiries', 'testimonials'];
        const seedData = getSeedData();

        for (const colName of collections) {
            const count = await db.collection(colName).countDocuments();
            if (count === 0 && seedData[colName] && seedData[colName].length > 0) {
                await db.collection(colName).insertMany(seedData[colName]);
                console.log(`[MongoDB Atlas] Seeded ${colName} with ${seedData[colName].length} items.`);
            }
        }

        // Seed settings if empty
        const settingsCount = await db.collection('settings').countDocuments();
        if (settingsCount === 0 && seedData.settings) {
            await db.collection('settings').insertOne({ _id: 'boutique_settings', ...seedData.settings });
            console.log('[MongoDB Atlas] Seeded boutique settings.');
        }

        // Seed analytics if empty
        const analyticsCount = await db.collection('analytics').countDocuments();
        if (analyticsCount === 0 && seedData.analytics) {
            await db.collection('analytics').insertOne({ _id: 'boutique_analytics', ...seedData.analytics });
            console.log('[MongoDB Atlas] Seeded analytics data.');
        }
    } catch (err) {
        console.error('[MongoDB Atlas] Seed check failed:', err.message);
    }
}

// Asynchronous MongoDB reader with fallback to JSON
export async function getDbAsync() {
    try {
        await seedMongoIfEmpty();
        const db = await getDatabase();

        const products = await db.collection('products').find({}).toArray();
        const categories = await db.collection('categories').find({}).toArray();
        const chapters = await db.collection('chapters').find({}).toArray();
        const gallery = await db.collection('gallery').find({}).toArray();
        const offers = await db.collection('offers').find({}).toArray();
        const enquiries = await db.collection('enquiries').find({}).toArray();
        const testimonials = await db.collection('testimonials').find({}).toArray();
        const settingsDoc = await db.collection('settings').findOne({ _id: 'boutique_settings' });
        const analyticsDoc = await db.collection('analytics').findOne({ _id: 'boutique_analytics' });
        const auditLogs = await db.collection('auditLogs').find({}).sort({ timestamp: -1 }).limit(100).toArray();

        const result = {
            products: products.length > 0 ? products : getSeedData().products,
            categories: categories.length > 0 ? categories : getSeedData().categories,
            chapters: chapters.length > 0 ? chapters : getSeedData().chapters,
            gallery: gallery.length > 0 ? gallery : getSeedData().gallery,
            offers: offers.length > 0 ? offers : getSeedData().offers,
            enquiries: enquiries.length > 0 ? enquiries : getSeedData().enquiries,
            testimonials: testimonials.length > 0 ? testimonials : getSeedData().testimonials,
            settings: settingsDoc || getSeedData().settings,
            analytics: analyticsDoc || getSeedData().analytics,
            auditLogs: auditLogs.length > 0 ? auditLogs : getSeedData().auditLogs,
        };

        // Sync local db.json
        writeDb(result);
        return result;
    } catch (err) {
        console.warn('[MongoDB Atlas] Failed to connect to Atlas, using local database:', err.message);
        return readDb();
    }
}

// Read database from file, auto-seeding if file does not exist
export function readDb() {
    try {
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
        }

        if (!fs.existsSync(DB_PATH)) {
            const seed = getSeedData();
            fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
            return seed;
        }

        const dataStr = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(dataStr);
    } catch (err) {
        console.error('Error reading database file:', err);
        return getSeedData();
    }
}

// Write database to file atomically & sync to MongoDB Atlas
export function writeDb(data) {
    try {
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
        }

        const tempPath = `${DB_PATH}.tmp`;
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
        fs.renameSync(tempPath, DB_PATH);

        // Async background sync to MongoDB Atlas
        getDatabase()
            .then(async (db) => {
                if (data.products) {
                    for (const p of data.products) {
                        const { _id, ...pData } = p;
                        await db.collection('products').updateOne({ id: p.id }, { $set: pData }, { upsert: true });
                    }
                }
                if (data.settings) {
                    const { _id, ...sData } = data.settings;
                    await db.collection('settings').updateOne({ _id: 'boutique_settings' }, { $set: sData }, { upsert: true });
                }
                if (data.testimonials) {
                    for (const t of data.testimonials) {
                        const { _id, ...tData } = t;
                        await db.collection('testimonials').updateOne({ id: t.id }, { $set: tData }, { upsert: true });
                    }
                }
                if (data.enquiries) {
                    for (const e of data.enquiries) {
                        const { _id, ...eData } = e;
                        await db.collection('enquiries').updateOne({ id: e.id }, { $set: eData }, { upsert: true });
                    }
                }
            })
            .catch((e) => console.warn('[MongoDB Sync] Warning:', e.message));

        return true;
    } catch (err) {
        console.error('Error writing database file:', err);
        return false;
    }
}

// Log audit action
export function addAuditLog(action, details, user = 'Admin') {
    try {
        const db = readDb();
        if (!db.auditLogs) db.auditLogs = [];
        db.auditLogs.unshift({
            id: `log-${Date.now()}`,
            user,
            action,
            details,
            timestamp: new Date().toISOString()
        });
        // Keep last 100 logs
        if (db.auditLogs.length > 100) {
            db.auditLogs = db.auditLogs.slice(0, 100);
        }
        writeDb(db);
    } catch (e) {
        console.error('Failed to log audit event:', e);
    }
}

