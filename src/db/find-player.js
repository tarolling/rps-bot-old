const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (id) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
    const query = { user_id: id };

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');
        const doc = await collection.findOne(query);
        return doc;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};