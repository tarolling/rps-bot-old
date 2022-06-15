const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI;

module.exports = async (id) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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