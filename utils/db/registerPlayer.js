const { addValues } = require('./values');
const { defaultRank } = require('../../config/settings.json');

const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (interaction) => {
    const defaultRole = interaction.guild.roles.cache.find(r => r.name === defaultRank);
    const userId = interaction.user.id;

    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const query = { $or: [{ user_id: userId }, { username: interaction.options.getString('username') }] }
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
            await interaction.member.roles.add(defaultRole);
            await collection.insertOne(doc);
            if (userId !== '417455238522339330') await interaction.member.setNickname(interaction.options.getString('username'));
            return interaction.editReply({ content: 'You have been registered. Have fun!', ephemeral: true });
        }
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};