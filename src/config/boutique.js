/**
 * Designs by Nisha — Centralized Boutique Configuration
 * Easy customization of contact details, WhatsApp integration, SEO, and Analytics
 */

export const boutiqueConfig = {
    name: "Designs by Nisha",
    tagline: "For Every Chapter of Her Story.",
    location: "Chattarpur, Chhatarpur, New Delhi, Delhi 110074",
    fullAddress: "318, near Aayushman Arogya Mandir (Dispensary, Block A1, Chattarpur, Chhatarpur, New Delhi, Delhi 110074",
    googleMapsUrl: "https://maps.google.com/?q=318+Block+A1+Chattarpur+Chhatarpur+New+Delhi+110074",

    // Lead Generation & Direct Channels
    // Note: Phone numbers use international format without leading + or spaces for WhatsApp API
    whatsapp: {
        number: "918218752043", // Configurable WhatsApp inquiry number
        displayNumber: "+91 82187 52043",
        defaultMessage: "Hi Designs by Nisha! I'm exploring your boutique collection and would love to enquire about bespoke outfits.",
    },

    instagram: {
        handle: "designsbynisha00",
        url: "https://www.instagram.com/designsbynisha00?igsh=Ym92OXh5emZsdm9t",
    },

    contact: {
        email: "enquire@designsbynisha.com",
        phoneDisplay: "+91 82187 52043",
        hours: "Monday – Saturday: 10:30 AM – 7:30 PM (By Appointment & Walk-ins)",
    },

    announcementBanner: {
        enabled: false,
        message: "Festive Season Special: Enjoy 15% off bespoke Bridal & Festive orders with code BRIDAL2026!",
        linkText: "Explore Bridal",
        linkUrl: "/collections/bridal-lehengas",
        bgType: "rose",
        speed: "normal",
    },

    // SEO & Verification
    seo: {
        siteUrl: "https://designsbynisha.com",
        defaultTitle: "Designs by Nisha — Luxury Women's & Bridal Boutique | Chattarpur, New Delhi",
        titleTemplate: "%s | Designs by Nisha Boutique Chattarpur New Delhi",
        description:
            "Luxury Indian women's fashion & bespoke bridal boutique in Chattarpur, Chhatarpur, New Delhi (318, near Aayushman Arogya Mandir Dispensary). Handcrafted Suits, Anarkalis, Bridal Lehengas, Maternity Gowns & Baby Clothes for every chapter of her story.",
        keywords: [
            "Women's boutique in Chattarpur New Delhi",
            "Bridal lehenga boutique Chattarpur Chhatarpur Delhi",
            "Boutique near Aayushman Arogya Mandir Chattarpur",
            "Suits and Anarkalis Chattarpur Delhi",
            "Haldi and Mehendi outfits Chhatarpur Delhi",
            "Maternity gowns Chattarpur New Delhi",
            "Baby occasion wear Chattarpur Delhi",
            "Bespoke Indian designer boutique Chattarpur",
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
            image: "/images/chapter-03.jpg",
            badge: "Chapter 03",
        },
        {
            id: "chapter-04",
            number: "04",
            title: "HER MOTHERHOOD",
            category: "Maternity & Feeding Gowns",
            slug: "maternity-gowns",
            tagline: "Elegance, softness, and room to glow as she steps into mothering.",
            description:
                "Breathable silk-cotton baby shower gowns, empire-waist maternity dresses, and nursing-friendly festive outfits tailored for expectant mothers.",
            image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop",
            badge: "Chapter 04",
        },
        {
            id: "chapter-05",
            number: "05",
            title: "HER LITTLE ONE",
            category: "Baby & Toddler Outfits",
            slug: "baby-clothes",
            tagline: "Miniature royalty for her child's first celebrations.",
            description:
                "Soft lining lehenga cholis, baby boy kurta sets, and matching mother-baby celebratory outfits crafted with skin-safe luxury fabrics.",
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop",
            badge: "Chapter 05",
        },
    ],
};

export function buildWhatsAppLink({
    productName,
    productCategory,
    price,
    productImage,
    productSlug,
    customMessage,
} = {}) {
    const baseUrl = `https://wa.me/${boutiqueConfig.whatsapp.number}`;

    if (customMessage) {
        return `${baseUrl}?text=${encodeURIComponent(customMessage)}`;
    }

    let message = boutiqueConfig.whatsapp.defaultMessage;

    if (productName) {
        message = `Hi Designs by Nisha! I am interested in inquiring about "${productName}"`;
        if (productCategory) message += ` (${productCategory})`;
        if (price) message += ` priced at ₹${Number(price).toLocaleString("en-IN")}`;
        if (productSlug) message += `. View outfit link: ${boutiqueConfig.seo.siteUrl}/product/${productSlug}`;
        message += `. Please let me know custom fitting availability and turn-around time.`;
    }

    return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
