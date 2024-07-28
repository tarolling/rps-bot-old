const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (collectionName) => {
    const collections = ['players', 'clubs'];
    if (!collections.includes(collectionName)) {
        return;
    }

    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection(collectionName);
        return await collection.countDocuments();
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
}