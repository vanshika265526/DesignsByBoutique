import { getProductByIdAsync, updateProductAsync, getDbAsync } from '../src/lib/db.js';

async function runVerification() {
    console.log("=== STARTING SEQUENTIAL MULTI-PRODUCT PERSISTENCE VERIFICATION ===");

    // Step 1: Read initial products
    const initialDb = await getDbAsync();
    const prodA = initialDb.products[0];
    const prodB = initialDb.products[1];
    const prodC = initialDb.products[2];
    const prodD = initialDb.products[3];

    console.log(`Original Prod A (${prodA.id}): "${prodA.name}"`);
    console.log(`Original Prod B (${prodB.id}): price=${prodB.price}`);
    console.log(`Original Prod C (${prodC.id}): desc="${prodC.shortDescription || prodC.description}"`);
    console.log(`Original Prod D (${prodD.id}): featured=${prodD.featured}`);

    // Update 1: Update Product A
    console.log("\n1. Updating Product A...");
    await updateProductAsync(prodA.id, { name: "VERIFIED_PRODUCT_A_EDIT" });

    // Verify after Update 1
    let dbState1 = await getDbAsync();
    let checkA1 = dbState1.products.find(p => p.id === prodA.id);
    console.log(` -> Product A name is now: "${checkA1.name}"`);
    if (checkA1.name !== "VERIFIED_PRODUCT_A_EDIT") throw new Error("Update A failed!");

    // Update 2: Update Product B
    console.log("\n2. Updating Product B...");
    await updateProductAsync(prodB.id, { price: 29999 });

    // Verify after Update 2: Product B MUST be updated AND Product A MUST retain its change
    let dbState2 = await getDbAsync();
    let checkA2 = dbState2.products.find(p => p.id === prodA.id);
    let checkB2 = dbState2.products.find(p => p.id === prodB.id);
    console.log(` -> Product A name is: "${checkA2.name}" (should be VERIFIED_PRODUCT_A_EDIT)`);
    console.log(` -> Product B price is: ${checkB2.price} (should be 29999)`);
    if (checkA2.name !== "VERIFIED_PRODUCT_A_EDIT") throw new Error("CRITICAL BUG: Product A reverted after updating Product B!");
    if (checkB2.price !== 29999) throw new Error("Update B failed!");

    // Update 3: Update Product C
    console.log("\n3. Updating Product C...");
    await updateProductAsync(prodC.id, { shortDescription: "VERIFIED_PRODUCT_C_EDIT" });

    // Verify after Update 3
    let dbState3 = await getDbAsync();
    let checkA3 = dbState3.products.find(p => p.id === prodA.id);
    let checkB3 = dbState3.products.find(p => p.id === prodB.id);
    let checkC3 = dbState3.products.find(p => p.id === prodC.id);
    console.log(` -> Product A name: "${checkA3.name}"`);
    console.log(` -> Product B price: ${checkB3.price}`);
    console.log(` -> Product C desc: "${checkC3.shortDescription}"`);
    if (checkA3.name !== "VERIFIED_PRODUCT_A_EDIT" || checkB3.price !== 29999) {
        throw new Error("CRITICAL BUG: Previous products reverted after updating Product C!");
    }

    // Update 4: Update Product D
    console.log("\n4. Updating Product D...");
    await updateProductAsync(prodD.id, { featured: true });

    // Verify final state: ALL 4 updates must remain saved!
    let finalDb = await getDbAsync();
    let finalA = finalDb.products.find(p => p.id === prodA.id);
    let finalB = finalDb.products.find(p => p.id === prodB.id);
    let finalC = finalDb.products.find(p => p.id === prodC.id);
    let finalD = finalDb.products.find(p => p.id === prodD.id);

    console.log("\n=== FINAL VERIFICATION SUMMARY ===");
    console.log(`Product A (${finalA.id}) Name: "${finalA.name}" [OK]`);
    console.log(`Product B (${finalB.id}) Price: ${finalB.price} [OK]`);
    console.log(`Product C (${finalC.id}) ShortDesc: "${finalC.shortDescription}" [OK]`);
    console.log(`Product D (${finalD.id}) Featured: ${finalD.featured} [OK]`);

    if (
        finalA.name === "VERIFIED_PRODUCT_A_EDIT" &&
        finalB.price === 29999 &&
        finalC.shortDescription === "VERIFIED_PRODUCT_C_EDIT" &&
        finalD.featured === true
    ) {
        console.log("\n>>> SUCCESS: ALL PRODUCT UPDATES REMAIN PERSISTED INDEPENDENTLY! NO REVERSIONS OCCURRED. <<<");
    } else {
        throw new Error("Verification failed! Data was reverted.");
    }

    // Clean up: restore original values
    console.log("\nRestoring original product state...");
    await updateProductAsync(prodA.id, { name: prodA.name });
    await updateProductAsync(prodB.id, { price: prodB.price });
    await updateProductAsync(prodC.id, { shortDescription: prodC.shortDescription });
    await updateProductAsync(prodD.id, { featured: prodD.featured });
    console.log("Restoration complete.");
}

runVerification().catch(err => {
    console.error("VERIFICATION FAILED:", err);
    process.exit(1);
});
