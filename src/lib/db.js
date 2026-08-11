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
        auditLogs: [
            {
                id: 'log-1',
                user: 'Admin',
                action: 'System initialized',
                details: 'Database seeded with default boutique products, categories, and settings.',
                timestamp: new Date().toISOString()
            }
        ]
    };
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

// Write database to file atomically
export function writeDb(data) {
    try {
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
        }

        const tempPath = `${DB_PATH}.tmp`;
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
        fs.renameSync(tempPath, DB_PATH);
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
