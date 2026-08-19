import { boutiqueConfig } from "@/config/boutique";
import { getDbAsync } from "@/lib/db";
import { categoriesTaxonomy } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function sitemap() {
    const baseUrl = boutiqueConfig.seo.siteUrl;
    const db = await getDbAsync();

    const staticRoutes = [
        "",
        "/collections",
        "/our-story",
        "/gallery",
        "/contact",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
    }));

    const categoryRoutes = categoriesTaxonomy.map((cat) => ({
        url: `${baseUrl}/collections/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const products = db.products || [];
    const publishedProducts = products.filter((p) => p.status === "published" || !p.status);

    const productRoutes = publishedProducts.map((p) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
