import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error(
        "[MongoDB] MONGODB_URI is not set. Falling back to localhost — in production this means live product data will NOT load."
    );
}

const connectionString = uri || "mongodb://127.0.0.1:27017/designs_by_nisha";

const options = {
    retryWrites: true,
    w: "majority",
    authSource: "admin",
    // A cold serverless instance pays SRV/DNS resolution + TLS handshake before
    // Atlas is reachable. The old 5s server-selection budget regularly expired on
    // that very first request, which is what made the site render the stale
    // bundled JSON ("old products") until a warm instance took over.
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 20000,
    maxPoolSize: 10,
    minPoolSize: 0,
};

// Cache the connection on globalThis in EVERY environment. A Vercel lambda reuses
// module scope between invocations, and globalThis additionally survives module
// duplication (RSC bundle vs. route-handler bundle).
const globalForMongo = globalThis;

// Returns a promise for a CONNECTED client. On failure the cached promise is
// cleared so the next call retries.
//
// The previous implementation did `client.connect().catch(() => null)` at module
// load, which cached the FAILURE permanently: once a cold start timed out, every
// later request on that instance saw `null` and silently fell back to the stale
// bundled data for the lifetime of the instance.
function getClientPromise() {
    if (!globalForMongo.__mongoClientPromise) {
        globalForMongo.__mongoClientPromise = new MongoClient(connectionString, options)
            .connect()
            .catch((err) => {
                globalForMongo.__mongoClientPromise = undefined;
                throw err;
            });
    }
    return globalForMongo.__mongoClientPromise;
}

const DB_NAME = process.env.MONGODB_DB || "designs_by_nisha";
const CONNECT_ATTEMPTS = 3;

export async function getDatabase() {
    let lastErr;
    for (let attempt = 1; attempt <= CONNECT_ATTEMPTS; attempt += 1) {
        try {
            const client = await getClientPromise();
            return client.db(DB_NAME);
        } catch (err) {
            lastErr = err;
            globalForMongo.__mongoClientPromise = undefined;
            console.warn(`[MongoDB] Connect attempt ${attempt}/${CONNECT_ATTEMPTS} failed: ${err.message}`);
            if (attempt < CONNECT_ATTEMPTS) {
                await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
            }
        }
    }
    throw new Error(`MongoDB connection failed after ${CONNECT_ATTEMPTS} attempts: ${lastErr?.message}`);
}

// Kept for compatibility with any `import clientPromise from '@/lib/mongodb'`.
export default getClientPromise;
