const { addValues } = require('../db/values');

const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (interaction) => {
    const { user } = interaction;
    const userId = user.id;

    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const query = { $or: [{ user_id: userId }] };
    const doc = addValues(interaction);

    try {
        // inserting the document into the database
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const check = await collection.findOne(query);
        if (check) {
            if (check.user_id === userId) {
                return interaction.editReply({ content: `You are already registered with the username **${check.username}**.`, ephemeral: true });
            } else {
                return interaction.editReply({ content: `The username **${check.username}** is already taken.`, ephemeral: true });
            }
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