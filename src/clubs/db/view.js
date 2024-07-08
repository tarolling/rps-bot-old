const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (interaction) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
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