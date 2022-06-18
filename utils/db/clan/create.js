const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;

module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const userId = interaction.user.id;
    const playerQuery = { members: userId };

    const clanName = interaction.options.getString('clan_name');
    const clanAbbr = interaction.options.getString('abbreviation').toUpperCase();
    const clanQuery = { name: { $regex: clanName, $options: 'i' } };

    const doc = { leader: userId, name: clanName, abbreviation: clanAbbr, members: [userId] };

    try {
        await dbClient.connect();
        const clanCollection = dbClient.db('rps').collection('clans');
        const playerCollection = dbClient.db('rps').collection('players');

        let validation = await clanCollection.findOne(playerQuery);
        if (validation) {
            interaction.editReply({ content: `You are already part of this clan -> ${validation.name}` });
            return null;
        }

        validation = await clanCollection.findOne(clanQuery);
        if (validation) {
            interaction.editReply({ content: 'This clan already exists.' });
            return null;
        }

        await clanCollection.insertOne(doc);
        interaction.editReply({ content: `You have successfully created ${clanName}!` });

        let playerName = await playerCollection.findOne({ user_id: userId });
        playerName = playerName?.username;
        return (playerName) ? `[${clanAbbr}] ${playerName}` : null;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};