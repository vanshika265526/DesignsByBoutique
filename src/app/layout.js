import "./globals.css";
import { boutiqueConfig } from "@/config/boutique";

export const metadata = {
    metadataBase: new URL(boutiqueConfig.seo.siteUrl),
    title: {
        default: boutiqueConfig.seo.defaultTitle,
        template: boutiqueConfig.seo.titleTemplate,
    },
    description: boutiqueConfig.seo.description,
    keywords: boutiqueConfig.seo.keywords,
    icons: {
        icon: "/images/logo.png",
        apple: "/images/logo.png",
    },
    openGraph: {
        title: boutiqueConfig.seo.defaultTitle,
        description: boutiqueConfig.seo.description,
        url: boutiqueConfig.seo.siteUrl,
        siteName: boutiqueConfig.name,
        images: [
            {
                url: "https://images.pexels.com/photos/12579916/pexels-photo-12579916.jpeg?auto=compress&cs=tinysrgb&w=1600",
                width: 1200,
                height: 630,
                alt: "Designs by Nisha Luxury Boutique Chattarpur New Delhi",
            },
        ],
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: boutiqueConfig.seo.defaultTitle,
        description: boutiqueConfig.seo.description,
        images: ["https://images.pexels.com/photos/12579916/pexels-photo-12579916.jpeg?auto=compress&cs=tinysrgb&w=1600"],
    },
    verification: {
        google: boutiqueConfig.seo.googleSiteVerification,
    },
    alternates: {
        canonical: boutiqueConfig.seo.siteUrl,
    },
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": ["ClothingStore", "LocalBusiness"],
        name: boutiqueConfig.name,
        image: "https://images.pexels.com/photos/12579916/pexels-photo-12579916.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "@id": boutiqueConfig.seo.siteUrl,
        url: boutiqueConfig.seo.siteUrl,
        telephone: boutiqueConfig.contact.phoneDisplay,
        priceRange: "₹₹₹",
        address: {
            "@type": "PostalAddress",
            streetAddress: "318, near Aayushman Arogya Mandir (Dispensary, Block A1, Chattarpur",
            addressLocality: "Chhatarpur, New Delhi",
            addressRegion: "Delhi",
            postalCode: "110074",
            addressCountry: "IN",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 28.5042,
            longitude: 77.1843,
        },
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "10:30",
            closes: "19:30",
        },
        sameAs: [boutiqueConfig.instagram.url],
    };

    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="min-h-screen flex flex-col bg-boutique-bg text-boutique-charcoal antialiased">
                {children}
            </body>
        </html>
    );
}
