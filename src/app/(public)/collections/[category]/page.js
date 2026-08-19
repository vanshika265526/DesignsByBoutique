import { notFound } from "next/navigation";
import { boutiqueConfig } from "@/config/boutique";
import { getDbAsync } from "@/lib/db";
import { categoriesTaxonomy } from "@/data/products";
import SubcategoryProductsLayout from "@/components/collections/SubcategoryProductsLayout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
    const newSlugs = categoriesTaxonomy.map((c) => ({ category: c.slug }));
    const legacySlugs = [
        { category: "suits-anarkalis" },
        { category: "gowns-lehengas" },
        { category: "haldi-mehendi" },
        { category: "maternity-gowns" },
        { category: "baby-clothes" },
        { category: "bridal-lehengas" },
    ];
    return [...newSlugs, ...legacySlugs];
}

// Map legacy category slugs to new category taxonomy
function resolveCategory(slug) {
    if (!slug) return null;
    const lower = slug.toLowerCase();

    // Check direct match in new taxonomy first
    let found = categoriesTaxonomy.find(c => c.slug === lower || c.id === lower);
    if (found) return found;

    // Legacy mappings
    if (lower === "suits-anarkalis" || lower === "her-beginnings") return categoriesTaxonomy.find(c => c.slug === "her-beginning");
    if (lower === "gowns-lehengas" || lower === "her-forever") return categoriesTaxonomy.find(c => c.slug === "her-bridal-story");
    if (lower === "haldi-mehendi" || lower === "her-new-chapter" || lower === "bridal-lehengas") return categoriesTaxonomy.find(c => c.slug === "her-big-day");
    if (lower === "baby-clothes" || lower === "her-little-one") return categoriesTaxonomy.find(c => c.slug === "baby-girl-dresses");
    if (lower === "maternity-gowns" || lower === "her-motherhood") return categoriesTaxonomy.find(c => c.slug === "maternity");

    return null;
}

export async function generateMetadata({ params }) {
    const categoryParam = params.category;
    const cat = resolveCategory(categoryParam);

    if (!cat) {
        return { title: "Collection | Designs by Nisha Chattarpur New Delhi" };
    }

    return {
        title: `${cat.name} Collection | Chattarpur New Delhi`,
        description: `${cat.description} Available at Designs by Nisha Boutique, 318 near Aayushman Arogya Mandir, Chattarpur, New Delhi.`,
    };
}

export default async function CategoryPage({ params }) {
    const categorySlug = params.category;
    const db = await getDbAsync();
    const categories = db.categories || categoriesTaxonomy;

    const taxonomyCategory = resolveCategory(categorySlug);
    const categoryObj = categories.find((category) =>
        category.slug === categorySlug ||
        category.id === categorySlug ||
        (taxonomyCategory && category.slug === taxonomyCategory.slug)
    );
    const resolvedCategory = taxonomyCategory
        ? { ...taxonomyCategory, ...(categoryObj || {}), slug: taxonomyCategory.slug }
        : categoryObj;

    if (!resolvedCategory) {
        notFound();
    }

    // Filter products belonging to this category
    const allProducts = db.products || [];
    const categoryProducts = allProducts.filter((product) => {
        const isPublished = product.status === "published" || !product.status;
        if (!isPublished) return false;

        const pCat = (product.category || "").toLowerCase();
        const pSlug = (product.categorySlug || "").toLowerCase();
        const pChapter = (product.chapter || "").toLowerCase();
        const targetSlug = resolvedCategory.slug.toLowerCase();

        // Direct slug match
        if (pCat === targetSlug || pSlug === targetSlug) return true;

        // Category cross-mappings
        if (targetSlug === "baby-girl-dresses" && (pCat === "baby-clothes" || pChapter === "her-little-one")) return true;
        if (targetSlug === "her-beginning" && (pCat === "suits-anarkalis" || pCat === "suits" || pChapter === "her-beginnings")) return true;
        if (targetSlug === "her-bridal-story" && (pCat === "gowns-lehengas" || pCat === "bridal-lehengas" || pChapter === "her-forever")) return true;
        if (targetSlug === "her-big-day" && (pCat === "haldi-mehendi" || pCat === "bridal-lehengas" || pCat === "gowns-lehengas" || pChapter === "her-new-chapter")) return true;
        if (targetSlug === "maternity" && (pCat === "maternity-gowns" || pChapter === "her-motherhood")) return true;

        return false;
    });

    return (
        <div className="pt-3 md:pt-4 pb-16 bg-boutique-bg min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                {/* Interactive Subcategory Pills & Products Layout (Matching user design diagram) */}
                <SubcategoryProductsLayout
                    category={resolvedCategory}
                    products={categoryProducts}
                />
            </div>
        </div>
    );
}
