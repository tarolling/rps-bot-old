const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = process.env.DB_URI;

module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await dbClient.connect();

        const collection = dbClient.db('rps').collection('players');
        const query = { user_id: interaction.user.id };
        const doc = { $set: { username: interaction.options.getString('username') } };

        const check = await collection.findOne(query);
        if (!check) return interaction.editReply({ content: 'You are not registered.', ephemeral: true });

        await collection.updateOne(query, doc);
        await interaction.member.setNickname(interaction.options.getString('username'));
        await interaction.editReply({ content: 'Your username has been changed.', ephemeral: true });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};