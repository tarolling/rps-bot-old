const { addValues } = require('./values');
const { defaultRank, specialRank } = require('../../config/settings.json');

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = process.env.DB_URI;

const specialPlayers = [
    '720485519242297405', // Sportsboy
    '659434194275008520', // Pizza
    '453011040431767582', // Valk
    '475717705693921280', // Herbs
    '275424291875454976', // Aspect
    '530542709279162403', // Fire
    '345640671014551552', // kdn
    '710621968579166228', // Wahvey
    '334192291784818689', // Anon
    '134078076953952257', // NightOwl
    '414125889635352576', // Cas
    '530864194258731018', // Auts
    '779928003521806340', // KingOfPink
];

module.exports = async (interaction) => {
    const defaultRole = interaction.guild.roles.cache.find(r => r.name === defaultRank);
    const specialRole = interaction.guild.roles.cache.find(r => r.name === specialRank);
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
            if (specialPlayers.includes(userId)) {
                doc.rank = specialRank;
                doc.elo = 1300;
                await interaction.member.roles.add(specialRole);
                await interaction.user.send(`Welcome back ${interaction.user.username}! i love you lol also you will be starting a rank above`);
            } else {
                await interaction.member.roles.add(defaultRole);
            }
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