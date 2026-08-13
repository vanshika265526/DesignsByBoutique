import { signSession, SESSION_COOKIE } from '../src/lib/adminAuth.js';

const BASE_URL = 'http://localhost:3001';
const token = signSession('admin@boutique');

const authHeaders = {
    'Content-Type': 'application/json',
    'Cookie': `${SESSION_COOKIE}=${token}`
};

async function testApiPersistence() {
    console.log("=== STARTING LIVE AUTHENTICATED API PRODUCT PERSISTENCE VERIFICATION ===");

    // Step 0: Get initial products
    const initialRes = await fetch(`${BASE_URL}/api/data/products`);
    const initialJson = await initialRes.json();
    const products = initialJson.data;

    if (!products || products.length < 4) {
        throw new Error("Insufficient products found for verification test");
    }

    const prodA = products[0];
    const prodB = products[1];
    const prodC = products[2];
    const prodD = products[3];

    console.log(`Original Prod A (${prodA.id}): name="${prodA.name}"`);
    console.log(`Original Prod B (${prodB.id}): price=${prodB.price}`);
    console.log(`Original Prod C (${prodC.id}): shortDescription="${prodC.shortDescription || ''}"`);
    console.log(`Original Prod D (${prodD.id}): featured=${prodD.featured}`);

    const newNameA = "Royal Heritage Lehenga A (Updated)";
    const newPriceB = 34999;
    const newDescC = "Handcrafted bespoke bridal silhouette C (Updated)";
    const newFeaturedD = !prodD.featured;

    // --- STEP 1: Update Product A ---
    console.log(`\n--- STEP 1: Updating Product A (${prodA.id}) ---`);
    const patchResA = await fetch(`${BASE_URL}/api/data/products/${prodA.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ name: newNameA }),
    });
    const patchJsonA = await patchResA.json();
    console.log(`Patch A Response: success=${patchJsonA.success}`);
    if (!patchJsonA.success) throw new Error(`Patch A failed: ${patchJsonA.error}`);

    // Verify Product A alone
    const check1 = await (await fetch(`${BASE_URL}/api/data/products/${prodA.id}`)).json();
    console.log(` -> Product A Name: "${check1.data.name}"`);
    if (check1.data.name !== newNameA) throw new Error("Product A update failed!");

    // --- STEP 2: Update Product B ---
    console.log(`\n--- STEP 2: Updating Product B (${prodB.id}) ---`);
    const patchResB = await fetch(`${BASE_URL}/api/data/products/${prodB.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ price: newPriceB }),
    });
    const patchJsonB = await patchResB.json();
    console.log(`Patch B Response: success=${patchJsonB.success}`);
    if (!patchJsonB.success) throw new Error(`Patch B failed: ${patchJsonB.error}`);

    // Verify Product A AND Product B after Step 2
    const checkA_afterB = await (await fetch(`${BASE_URL}/api/data/products/${prodA.id}`)).json();
    const checkB_afterB = await (await fetch(`${BASE_URL}/api/data/products/${prodB.id}`)).json();

    console.log(` -> Product A Name after B edit: "${checkA_afterB.data.name}"`);
    console.log(` -> Product B Price after B edit: ${checkB_afterB.data.price}`);

    if (checkA_afterB.data.name !== newNameA) {
        throw new Error("CRITICAL BUG DETECTED: Product A reverted after editing Product B!");
    }
    if (checkB_afterB.data.price !== newPriceB) {
        throw new Error("Product B update failed!");
    }

    // --- STEP 3: Update Product C ---
    console.log(`\n--- STEP 3: Updating Product C (${prodC.id}) ---`);
    const patchResC = await fetch(`${BASE_URL}/api/data/products/${prodC.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ shortDescription: newDescC }),
    });
    const patchJsonC = await patchResC.json();
    console.log(`Patch C Response: success=${patchJsonC.success}`);
    if (!patchJsonC.success) throw new Error(`Patch C failed: ${patchJsonC.error}`);

    // --- STEP 4: Update Product D ---
    console.log(`\n--- STEP 4: Updating Product D (${prodD.id}) ---`);
    const patchResD = await fetch(`${BASE_URL}/api/data/products/${prodD.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ featured: newFeaturedD }),
    });
    const patchJsonD = await patchResD.json();
    console.log(`Patch D Response: success=${patchJsonD.success}`);
    if (!patchJsonD.success) throw new Error(`Patch D failed: ${patchJsonD.error}`);

    // --- FINAL FULL VERIFICATION: Fetch ALL products ---
    console.log("\n--- FINAL VERIFICATION ACROSS FULL PRODUCT CATALOG ---");
    const allRes = await fetch(`${BASE_URL}/api/data/products`);
    const allJson = await allRes.json();
    const allProds = allJson.data;

    const finalA = allProds.find(p => p.id === prodA.id);
    const finalB = allProds.find(p => p.id === prodB.id);
    const finalC = allProds.find(p => p.id === prodC.id);
    const finalD = allProds.find(p => p.id === prodD.id);

    const passedA = finalA.name === newNameA;
    const passedB = finalB.price === newPriceB;
    const passedC = finalC.shortDescription === newDescC;
    const passedD = finalD.featured === newFeaturedD;

    console.log(`Final Product A (${finalA.id}): name="${finalA.name}" (Passed: ${passedA})`);
    console.log(`Final Product B (${finalB.id}): price=${finalB.price} (Passed: ${passedB})`);
    console.log(`Final Product C (${finalC.id}): shortDescription="${finalC.shortDescription}" (Passed: ${passedC})`);
    console.log(`Final Product D (${finalD.id}): featured=${finalD.featured} (Passed: ${passedD})`);

    if (passedA && passedB && passedC && passedD) {
        console.log("\n==================================================================");
        console.log(">>> VERIFICATION SUCCESSFUL: ALL 4 PRODUCT UPDATES ARE PERSISTED! <<<");
        console.log(">>> NO PREVIOUS PRODUCT CHANGES WERE REVERTED OR OVERWRITTEN. <<<");
        console.log("==================================================================");
    } else {
        throw new Error(`Verification failed! Mismatches: A:${passedA}, B:${passedB}, C:${passedC}, D:${passedD}`);
    }

    // Cleanup: Restore initial values
    console.log("\nCleaning up test data...");
    await fetch(`${BASE_URL}/api/data/products/${prodA.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ name: prodA.name }),
    });
    await fetch(`${BASE_URL}/api/data/products/${prodB.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ price: prodB.price }),
    });
    await fetch(`${BASE_URL}/api/data/products/${prodC.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ shortDescription: prodC.shortDescription || '' }),
    });
    await fetch(`${BASE_URL}/api/data/products/${prodD.id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ featured: prodD.featured }),
    });
    console.log("Test cleanup completed successfully.");
}

testApiPersistence().catch(err => {
    console.error("HTTP VERIFICATION ERROR:", err.message);
    console.error(err.stack);
    process.exit(1);
});
