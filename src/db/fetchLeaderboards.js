const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (numRecords, type) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    if (type === 'players' || type === 'clubs') return null;

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection(type);

        const records = await collection.find().sort({ elo: -1 }).limit(numRecords).toArray();
        if (!records || records?.length === 0) return null;

        return records;
    } catch (err) {
        console.log(err);
    } finally {
        await dbClient.close();
    }
};