import { boutiqueConfig } from "@/config/boutique";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/api/"],
            },
        ],
        sitemap: `${boutiqueConfig.seo.siteUrl}/sitemap.xml`,
    };
}
