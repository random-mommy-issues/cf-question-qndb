import db from "./dbClass.js";

class qnDB {
    constructor(dbInstance) {
        this.db = dbInstance;
        this.collection = this.db.client.db("cf").collection("questions");
    }

    async insertMany(questionObj) {
        const result = await this.collection.insertMany(questionObj);
        return result;
    }
    async bulkUpsert(docs) {
        const ops = docs.map(doc => ({
            updateOne: {
                filter: { _id: doc._id },
                update: { $set: doc },
                upsert: true
            }
        }));

        if (ops.length) {
            await this.collection.bulkWrite(ops);
        }
    }
}



export default new qnDB(db);
