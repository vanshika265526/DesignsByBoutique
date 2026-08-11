import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://vanshika:vanshika@cluster0.9tovefw.mongodb.net/?appName=Cluster0";
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set in environment variables. Falling back to provided Atlas URI.");
}

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export async function getDatabase() {
    const connectedClient = await clientPromise;
    const dbName = process.env.MONGODB_DB || "designs_by_nisha";
    return connectedClient.db(dbName);
}

export default clientPromise;
