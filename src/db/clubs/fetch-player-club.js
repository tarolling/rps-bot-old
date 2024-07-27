const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (userID) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    const query = { members: userID };

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('clubs');

        return await collection.findOne(query);
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};