const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (numRecords) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('clubs');

        return await collection.find().limit(numRecords).toArray();
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};