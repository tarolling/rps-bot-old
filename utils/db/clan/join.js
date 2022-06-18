const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;

module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const userId = interaction.user.id;
    const playerQuery = { members: userId };

    const clanName = interaction.options.getString('clan_name');
    const clanQuery = { name: { $regex: clanName, $options: 'i' } };

    try {
        await dbClient.connect();
        const clanCollection = dbClient.db('rps').collection('clans');
        const playerCollection = dbClient.db('rps').collection('players');

        let validation = await clanCollection.findOne(playerQuery);
        if (validation) {
            interaction.editReply({ content: `You are already part of this clan -> ${validation.name}` });
            return null;
        }

        validation = await clanCollection.findOneAndUpdate(clanQuery, { $push: playerQuery });
        if (!validation.value) {
            interaction.editReply({ content: 'This clan does not exist.' });
            return null;
        }
        
        interaction.editReply({ content: `You have successfully joined ${validation.value.name}!` });

        let playerName = await playerCollection.findOne({ user_id: userId });
        playerName = playerName?.username;
        return (playerName) ? `[${validation.value.abbreviation}] ${playerName}` : null;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};