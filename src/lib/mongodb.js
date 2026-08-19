import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/designs_by_nisha";
const options = {
    retryWrites: true,
    w: "majority",
    authSource: "admin",
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set in environment variables. Using fallback connection string.");
}

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect()
            .catch(err => {
                console.warn('[MongoDB] Connection failed, using fallback:', err.message);
                return null;
            });
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
        .catch(err => {
            console.warn('[MongoDB] Connection failed, using fallback:', err.message);
            return null;
        });
}

export async function getDatabase() {
    const connectedClient = await clientPromise;
    if (!connectedClient) {
        throw new Error("MongoDB client is not connected");
    }
    const dbName = process.env.MONGODB_DB || "designs_by_nisha";
    return connectedClient.db(dbName);
}

export default clientPromise;
