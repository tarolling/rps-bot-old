const { MongoClient, ServerApiVersion } = require('mongodb');
const { addValues } = require('../db/values');



module.exports = async (interaction) => {
    const { user } = interaction;
    const userId = user.id;

    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
    const query = { user_id: userId };
    const doc = addValues(interaction);

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const check = await collection.findOne(query);
        if (!check) await collection.insertOne(doc);
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};