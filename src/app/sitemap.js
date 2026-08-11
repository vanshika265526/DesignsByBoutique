import { boutiqueConfig } from "@/config/boutique";
import { products } from "@/data/products";

export default function sitemap() {
    const baseUrl = boutiqueConfig.seo.siteUrl;

    const staticRoutes = [
        "",
        "/collections",
        "/our-story",
        "/gallery",
        "/contact",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
    }));

    const categoryRoutes = boutiqueConfig.chapters.map((ch) => ({
        url: `${baseUrl}/collections/${ch.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const productRoutes = products.map((p) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
