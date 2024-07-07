const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const clubName = interaction.options.getString('club_name');
    const query = { name: { $regex: clubName, $options: 'i' } };

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('clubs');

        let club = await collection.findOne(query);
        return club;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};