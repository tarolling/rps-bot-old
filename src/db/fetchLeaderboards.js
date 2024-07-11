const ranks = require('../../config/ranks.json');
const capitalize = require('../utils/capitalize');


const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async () => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const players = await collection.find().sort({ elo: -1 }).limit(10).toArray();
        if (!players || players?.length === 0) return null;

        return players;
    } catch (err) {
        console.log(err);
    } finally {
        await dbClient.close();
    }
};