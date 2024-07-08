const { careerResetValues } = require('./values');

const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (interaction) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const query = { user_id: interaction.options.getUser('user').id };
    const update = careerResetValues();

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const doc = await collection.findOneAndUpdate(query, update);
        if (!doc.value) return interaction.editReply({ content: 'The user you specified is not in the database.', ephemeral: true });
        return interaction.editReply({ content: 'User has been reset.', ephemeral: true });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};