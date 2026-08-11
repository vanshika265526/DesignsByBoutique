import { boutiqueConfig } from "@/config/boutique";

export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${boutiqueConfig.seo.siteUrl}/sitemap.xml`,
    };
}
