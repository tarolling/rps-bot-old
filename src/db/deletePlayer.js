const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const query = { user_id: interaction.options.getUser('user').id };

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const doc = await collection.findOneAndDelete(query);
        if (!doc.value) return interaction.editReply({ content: 'The user you specified is not in the database.', ephemeral: true });
        return interaction.editReply({ content: 'User has been removed from the database.', ephemeral: true });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};