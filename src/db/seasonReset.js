const { seasonResetValues } = require('./values');

const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (interaction) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const update = seasonResetValues();

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        await collection.updateMany({}, update);
        return interaction.editReply({ content: 'All users have been reset.', ephemeral: true });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};