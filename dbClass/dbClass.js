import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

class DB {
    constructor() {
        this.uri = process.env.MONGO_URI;

        if (!this.uri) {
            throw new Error("❌ MONGO_URI not found in .env");
        }

        this.client = new MongoClient(this.uri);
    }

    async connect() {
        await this.client.connect();
        console.log("✅ Connected to MongoDB");
    }
}

const db = new DB() ; 
await db.connect() ; 
export default db;