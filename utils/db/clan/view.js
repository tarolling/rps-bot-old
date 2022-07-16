const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const clanName = interaction.options.getString('clan_name');
    const query = { name: { $regex: clanName, $options: 'i' } };
    
    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('clans');

        let clan = await collection.findOne(query);
        return clan;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};