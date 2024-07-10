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
        // inserting the document into the database
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const check = await collection.findOne(query);
        if (check) {
            return interaction.editReply({ content: `You are already registered!`, ephemeral: true });
        } else {
            await collection.insertOne(doc);
            return interaction.editReply({ content: 'You have been registered. Have fun!', ephemeral: true });
        }
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};