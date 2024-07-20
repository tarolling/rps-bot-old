const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (interaction, numRecords) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
    const clubName = interaction.options.getString('name') ?? null;
    const query = { name: { $regex: clubName, $options: 'i' } };

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('clubs');

        if (clubName === null) {
            return await collection.find().limit(numRecords).toArray();
        }

        return await collection.findOne(query);
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};