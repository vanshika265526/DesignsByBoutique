/**
 * Designs by Nisha — Product & Collection Dataset & Shared Data Helpers
 * Connects the public website directly to the DB engine for single-source-of-truth.
 */

export const initialCategories = [
    {
        id: "suits-anarkalis",
        name: "Suits & Anarkalis",
        slug: "suits-anarkalis",
        chapter: "her-beginnings",
        description: "Graceful daily luxury & celebratory silk Anarkali suits.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        count: 24,
        published: true,
        order: 1
    },
    {
        id: "bridal-lehengas",
        name: "Bridal Lehengas",
        slug: "bridal-lehengas",
        chapter: "her-forever",
        description: "Hand-embroidered zardozi bridal masterpieces for her big day.",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
        count: 18,
        published: true,
        order: 2
    },
    {
        id: "haldi-mehendi",
        name: "Haldi & Mehendi",
        slug: "haldi-mehendi",
        chapter: "her-new-chapter",
        description: "Vibrant yellow kesar lehengas & emerald green shararas.",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
        count: 15,
        published: true,
        order: 3
    },
    {
        id: "maternity-gowns",
        name: "Maternity Gowns",
        slug: "maternity-gowns",
        chapter: "her-motherhood",
        description: "Featherlight silk maternity gowns & baby shower attire.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
        count: 12,
        published: true,
        order: 4
    },
    {
        id: "baby-clothes",
        name: "Baby Clothes",
        slug: "baby-clothes",
        chapter: "her-little-one",
        description: "Skin-friendly heirloom baby lehengas & festive kurti sets.",
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
        count: 16,
        published: true,
        order: 5
    }
];

export const initialChapters = [
    {
        id: "her-beginnings",
        number: "01",
        title: "Her Beginnings",
        subtitle: "Young Womanhood & Celebrations",
        description: "Elegance in everyday luxury, college festive days, and light family celebrations.",
        categorySlug: "suits-anarkalis",
        categoryName: "Suits & Anarkalis",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "her-forever",
        number: "02",
        title: "Her Forever",
        subtitle: "The Quintessential Bride",
        description: "Heirloom bridal lehengas, royal red velvets, and hand-worked zardozi ensembles.",
        categorySlug: "bridal-lehengas",
        categoryName: "Bridal Lehengas",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "her-new-chapter",
        number: "03",
        title: "Her New Chapter",
        subtitle: "Married Life & Festive Ceremonies",
        description: "Haldi yellow lehengas, emerald Mehendi shararas, and post-wedding dinner sarees.",
        categorySlug: "haldi-mehendi",
        categoryName: "Haldi & Mehendi",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "her-motherhood",
        number: "04",
        title: "Her Motherhood",
        subtitle: "Nurturing New Life",
        description: "Custom flowy maternity photoshoot gowns and soft breathable baby shower Anarkalis.",
        categorySlug: "maternity-gowns",
        categoryName: "Maternity Gowns",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "her-little-one",
        number: "05",
        title: "Her Little One",
        subtitle: "First Milestones & Baby Couture",
        description: "Zero-scratch lined miniature baby lehengas, Annaprashan outfits, and festive clothes.",
        categorySlug: "baby-clothes",
        categoryName: "Baby Clothes",
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop"
    }
];

export const initialProducts = [
    {
        id: "prod-01",
        slug: "gulzar-chanderi-anarkali-set",
        name: "Gulzar Chanderi Silk Anarkali Set",
        category: "suits-anarkalis",
        categoryName: "Suits & Anarkalis",
        chapter: "her-beginnings",
        chapterName: "Her Beginnings",
        price: 19600,
        originalPrice: 24500,
        discount: "20% OFF",
        featured: true,
        status: "published",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "A breathtaking floor-length Chanderi silk Anarkali in soft blush rose, featuring delicate hand-worked Gota Patti borders, organza dupatta with scalloped edges, and tailored fitted churidar.",
        shortDescription: "Soft blush rose Chanderi silk Anarkali with Gota Patti embroidery.",
        details: ["Pure Chanderi Silk & Organza Dupatta", "Custom sleeve length customization available", "Dry Clean Only"],
    },
    {
        id: "prod-02",
        slug: "noor-zardozi-straight-suit",
        name: "Noor Soft Mint Zardozi Kurta Set",
        category: "suits-anarkalis",
        categoryName: "Suits & Anarkalis",
        chapter: "her-beginnings",
        chapterName: "Her Beginnings",
        price: 15120,
        originalPrice: 18900,
        discount: "20% OFF",
        featured: false,
        status: "published",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "Elegant pastel mint straight kurta ensemble rendered in handloom Tussar silk, detailed with fine antique gold Zardozi thread work along the neckline and sleeves.",
        shortDescription: "Pastel mint straight Tussar silk kurta set with Zardozi detailing.",
        details: ["Handloom Tussar Silk with Net Dupatta", "Pants can be customized to straight or palazzo", "Dry Clean Only"],
    },
    {
        id: "prod-03",
        slug: "rose-royal-embroidered-bridal-lehenga",
        name: "Rose Royal Heirloom Bridal Lehenga",
        category: "bridal-lehengas",
        categoryName: "Bridal Lehengas",
        chapter: "her-forever",
        chapterName: "Her Forever",
        price: 116000,
        originalPrice: 145000,
        discount: "20% OFF",
        featured: true,
        status: "published",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "An heirloom masterpiece crafted for the quintessential bride. Deep crimson silk lehenga intricately embroidered with Mughal floral motifs, dabka work, zardozi gold threadwork, and paired with double organza dupattas.",
        shortDescription: "Crimson silk heirloom bridal lehenga with Zardozi & double dupattas.",
        details: ["Pure Mulberry Velvet Silk", "Bespoke Made-to-Measure fitting", "Custom latkans with wedding date embroidery"],
    },
    {
        id: "prod-04",
        slug: "kesar-haldi-yellow-silk-lehenga",
        name: "Kesar Haldi Sunshine Silk Lehenga",
        category: "bridal-lehengas",
        categoryName: "Bridal Lehengas",
        chapter: "her-forever",
        chapterName: "Her Forever",
        price: 33600,
        originalPrice: 42000,
        discount: "20% OFF",
        featured: true,
        status: "published",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "Vibrant mustard yellow raw silk lehenga designed for Haldi and Sangeet festivities. Features mirrored sequin work, gold zari borders, and a featherlight embroidered bandhani dupatta.",
        shortDescription: "Mustard raw silk Haldi lehenga with mirror sequin work.",
        details: ["Raw Silk & Handloom Bandhani Dupatta", "Custom blouse cut and waist fitting", "Dry Clean Only"],
    },
    {
        id: "prod-05",
        slug: "mehendi-emerald-sharara-set",
        name: "Emerald Mehendi Embroidered Sharara",
        category: "haldi-mehendi",
        categoryName: "Haldi & Mehendi",
        chapter: "her-new-chapter",
        chapterName: "Her New Chapter",
        price: 25600,
        originalPrice: 32000,
        discount: "20% OFF",
        featured: true,
        status: "published",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "A rich forest green georgette short kurta and dramatic tiered sharara set adorned with intricate mirror work, resham threadwork, and a sheer embroidered scalloped dupatta.",
        shortDescription: "Forest green georgette sharara set with mirror & resham threadwork.",
        details: ["Viscose Georgette & Soft Net Dupatta", "Tiered sharara volume customization", "Dry Clean Only"],
    },
    {
        id: "prod-06",
        slug: "rooh-blush-draped-saree-gown",
        name: "Rooh Blush Pre-Stitched Draped Saree",
        category: "haldi-mehendi",
        categoryName: "Haldi & Mehendi",
        chapter: "her-new-chapter",
        chapterName: "Her New Chapter",
        price: 22800,
        originalPrice: 28500,
        discount: "20% OFF",
        featured: false,
        status: "published",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "Modern cocktail and post-wedding occasion wear. A pre-stitched draped satin saree gown in rose taupe paired with a heavily hand-beaded crystal blouse.",
        shortDescription: "Pre-stitched rose taupe draped saree gown with beaded blouse.",
        details: ["Fluid Micro-Satin & Hand-beaded Net Blouse", "Pre-stitched pleats tailored to exact height"],
    },
    {
        id: "prod-07",
        slug: "grace-silk-maternity-photoshoot-gown",
        name: "Grace Powder Pink Silk Maternity Gown",
        category: "maternity-gowns",
        categoryName: "Maternity Gowns",
        chapter: "her-motherhood",
        chapterName: "Her Motherhood",
        price: 17600,
        originalPrice: 22000,
        discount: "20% OFF",
        featured: true,
        status: "published",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "Designed specifically for expecting mothers celebrating maternity photoshoots, baby showers, or grand family functions. Soft empire-waist flowy silhouette with stretchable inner lining and trailing chiffon cape.",
        shortDescription: "Powder pink empire-waist silk maternity gown with trailing cape.",
        details: ["Hypoallergenic Pure Satin Silk & Sheer Chiffon", "Hidden nursing zip & trimester adjustability"],
    },
    {
        id: "prod-08",
        slug: "aarya-floral-anarkali-maternity-gown",
        name: "Aarya Floral Hand-Printed Maternity Anarkali",
        category: "maternity-gowns",
        categoryName: "Maternity Gowns",
        chapter: "her-motherhood",
        chapterName: "Her Motherhood",
        price: 14000,
        originalPrice: 17500,
        discount: "20% OFF",
        featured: false,
        status: "published",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "Featherweight Mulmul cotton floral Anarkali maternity gown with delicate Gota work. Ultra-breathable, soothing on sensitive skin, and tailored with extra room for growing bellies.",
        shortDescription: "100% Mulmul cotton floral Anarkali maternity gown with Gota detail.",
        details: ["100% Organic Hand-printed Mulmul Cotton", "Discreet nursing zippers optional"],
    },
    {
        id: "prod-09",
        slug: "nirmal-miniature-bridal-lehenga-baby",
        name: "Nirmal Miniature Rose Baby Lehenga Set",
        category: "baby-clothes",
        categoryName: "Baby Clothes",
        chapter: "her-little-one",
        chapterName: "Her Little One",
        price: 9999,
        originalPrice: 12500,
        discount: "20% OFF",
        featured: true,
        status: "published",
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "A dream in miniature! Soft organza and Malmal cotton lined baby lehenga choli set in muted rose pink. Zero-scratch seams and ultra-soft elastic band designed specifically for delicate infant skin.",
        shortDescription: "Zero-scratch skin-friendly miniature baby lehenga in rose pink.",
        details: ["100% Cotton Lined Silk & Organza", "Mommy & Me matching option available"],
    },
    {
        id: "prod-10",
        slug: "choti-princess-zari-kurti-skirt-set",
        name: "Choti Princess Gold Zari Baby Kurti Set",
        category: "baby-clothes",
        categoryName: "Baby Clothes",
        chapter: "her-little-one",
        chapterName: "Her Little One",
        price: 7600,
        originalPrice: 9500,
        discount: "20% OFF",
        featured: false,
        status: "published",
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
        ],
        description: "Festive ivory and gold zari baby kurti paired with twirl-worthy flared skirt. Lightweight, lined with soft muslin, perfect for first Diwali, Annaprashan, or family weddings.",
        shortDescription: "Ivory & gold zari baby kurti set lined with soft muslin.",
        details: ["Soft Muslin Cotton & Jacquard Silk", "Matching headband included"],
    },
];

export const initialGallery = [
    { id: "lb-01", title: "Mughal Rose Bridal Story", category: "Bridal", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop", aspectRatio: "aspect-[3/4]", location: "Studio New Delhi" },
    { id: "lb-02", title: "Golden Hour Haldi Splendor", category: "Festive", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop", aspectRatio: "aspect-[4/5]", location: "Garden Courtyard" },
    { id: "lb-03", title: "Motherhood Grace & Silks", category: "Maternity", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", aspectRatio: "aspect-[3/4]", location: "New Delhi Atelier" },
    { id: "lb-04", title: "First Celebrations & Baby Heirloom", category: "Baby", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop", aspectRatio: "aspect-[1/1]", location: "Boutique Lounge" },
    { id: "lb-05", title: "Gulzar Anarkali Flow", category: "Suits", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop", aspectRatio: "aspect-[3/4]", location: "Heritage Suite" },
    { id: "lb-06", title: "Mehendi Emerald Splendor", category: "Festive", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop", aspectRatio: "aspect-[4/5]", location: "New Delhi Studio" },
];

export const initialOffers = [
    {
        id: "offer-1",
        title: "Festive Bridal Preview Discount",
        code: "BRIDAL2026",
        discountPercent: 15,
        description: "Exclusive 15% bespoke discount on all pre-booked Bridal Lehengas.",
        applicableCategory: "bridal-lehengas",
        active: true,
        startDate: "2026-08-01",
        endDate: "2026-10-31",
    }
];

export const products = initialProducts;
export const lookbookItems = initialGallery;

// Client & SSR compatible data getters
export function getProducts() {
    return initialProducts;
}

export function getFeaturedProducts() {
    return getProducts().filter((p) => p.featured);
}

export function getProductBySlug(slug) {
    return getProducts().find((p) => p.slug === slug || p.id === slug);
}

export function getProductsByCategory(categorySlug) {
    const all = getProducts();
    if (!categorySlug || categorySlug === "all") return all;
    return all.filter((p) => p.category === categorySlug || p.categorySlug === categorySlug);
}

export function getRelatedProducts(currentSlug, limit = 3) {
    const all = getProducts();
    const current = all.find((p) => p.slug === currentSlug || p.id === currentSlug);
    if (!current) return all.slice(0, limit);
    const sameCat = all.filter((p) => (p.category === current.category || p.categorySlug === current.categorySlug) && p.slug !== currentSlug);
    if (sameCat.length >= limit) return sameCat.slice(0, limit);
    const remaining = all.filter((p) => p.slug !== currentSlug && !sameCat.includes(p));
    return [...sameCat, ...remaining].slice(0, limit);
}

export function getCategories() {
    return initialCategories;
}

export function getChapters() {
    return initialChapters;
}

export function getGalleryItems() {
    return initialGallery;
}
