/**
 * Designs by Nisha — Centralized Boutique Configuration
 * Easy customization of contact details, WhatsApp integration, SEO, and Analytics
 */

export const boutiqueConfig = {
    name: "Designs by Nisha",
    tagline: "For Every Chapter of Her Story.",
    location: "New Delhi, India",
    fullAddress: "Design Studio & Boutique, Defence Colony / South Extension, New Delhi - 110024, India",
    googleMapsUrl: "https://maps.google.com/?q=Designs+by+Nisha+New+Delhi",

    // Lead Generation & Direct Channels
    // Note: Phone numbers use international format without leading + or spaces for WhatsApp API
    whatsapp: {
        number: "919876543210", // Configurable WhatsApp inquiry number
        displayNumber: "+91 98765 43210",
        defaultMessage: "Hi Designs by Nisha! I'm exploring your boutique collection and would love to enquire about bespoke outfits.",
    },

    instagram: {
        handle: "@designsbynisha",
        url: "https://instagram.com/designsbynisha",
    },

    contact: {
        email: "enquire@designsbynisha.com",
        phoneDisplay: "+91 98765 43210",
        hours: "Monday – Saturday: 10:30 AM – 7:30 PM (By Appointment & Walk-ins)",
    },

    // SEO & Verification Placeholders
    seo: {
        siteUrl: "https://designsbynisha.com",
        defaultTitle: "Designs by Nisha — Luxury Women's & Bridal Boutique | New Delhi",
        titleTemplate: "%s | Designs by Nisha Boutique New Delhi",
        description:
            "Luxury Indian women's fashion & bespoke bridal boutique in New Delhi. Thoughtfully curated Suits, Anarkalis, Bridal Lehengas, Maternity Gowns & Baby Clothes for every chapter of her story.",
        keywords: [
            "Women's boutique in New Delhi",
            "Bridal lehenga boutique Delhi",
            "Suits and Anarkalis Delhi",
            "Haldi and Mehendi outfits Delhi",
            "Maternity gowns New Delhi",
            "Baby occasion wear Delhi",
            "Bespoke Indian designer boutique",
            "Designs by Nisha",
        ],
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX",
        googleSiteVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "gsc-verification-code-placeholder",
    },

    // Her Story 5 Life Chapters
    chapters: [
        {
            id: "chapter-01",
            number: "01",
            title: "HER BEGINNINGS",
            category: "Suits & Anarkalis",
            slug: "suits-anarkalis",
            tagline: "For young women, festive celebrations and everyday grace.",
            description:
                "Floaty hand-embroidered Anarkalis, silk kurti sets, and contemporary festive ensembles designed for modern young women stepping into their spotlight.",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
            badge: "Chapter 01",
        },
        {
            id: "chapter-02",
            number: "02",
            title: "HER FOREVER",
            category: "Haldi • Mehendi • Bridal",
            slug: "bridal-lehengas",
            tagline: "For the unforgettable moments that begin a lifetime.",
            description:
                "Heirloom bridal lehengas, vibrant Haldi mustard yellow silks, and romantic Mehendi hand-worked ensembles tailored with royal Indian craftsmanship.",
            image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
            badge: "Chapter 02",
        },
        {
            id: "chapter-03",
            number: "03",
            title: "HER NEW CHAPTER",
            category: "Festive & Occasion Wear",
            slug: "haldi-mehendi",
            tagline: "Fashion for grand celebrations beyond the wedding day.",
            description:
                "Sophisticated shararas, draped saree gowns, and embellished festive silhouettes for newlyweds and women hosting life's milestone dinners.",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
            badge: "Chapter 03",
        },
        {
            id: "chapter-04",
            number: "04",
            title: "HER MOTHERHOOD",
            category: "Maternity Gowns",
            slug: "maternity-gowns",
            tagline: "Graceful silhouettes for one of life's most divine transitions.",
            description:
                "Breathable silk maternity gowns, photo-shoot ready draped silhouettes, and adaptable occasion wear crafted with soft lining and maximum comfort.",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
            badge: "Chapter 04",
        },
        {
            id: "chapter-05",
            number: "05",
            title: "HER LITTLE ONE",
            category: "Baby Clothes & Occasion Wear",
            slug: "baby-clothes",
            tagline: "Tiny heirloom outfits for the newest chapter of her story.",
            description:
                "Miniature designer lehengas, soft cotton kurti sets, and ceremony outfits tailored with skin-friendly fabrics for newborns and infants.",
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
            badge: "Chapter 05",
        },
    ],
};

/**
 * Generate a direct WhatsApp deep-link with pre-filled enquiry message
 */
export function buildWhatsAppLink({ productName, productCategory, price, customMessage } = {}) {
    const phone = boutiqueConfig.whatsapp.number;
    let text = boutiqueConfig.whatsapp.defaultMessage;

    if (productName) {
        text = `Hi Designs by Nisha! I'm interested in the "${productName}"${productCategory ? ` (${productCategory})` : ""
            }${price ? ` listed at ₹${price.toLocaleString("en-IN")}` : ""}. Could you please share more details, fabric samples, and customization options?`;
    } else if (customMessage) {
        text = customMessage;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
