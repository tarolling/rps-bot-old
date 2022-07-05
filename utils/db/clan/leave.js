const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const userId = interaction.user.id;
    const playerQuery = { members: userId };
    

    try {
        await dbClient.connect();
        const clanCollection = dbClient.db('rps').collection('clans');
        const playerCollection = dbClient.db('rps').collection('players');

        let clan = await clanCollection.findOneAndUpdate(playerQuery, { $pull: playerQuery });
        if (!clan) {
            interaction.editReply({ content: `You are not a part of any clan.` });
            return null;
        }

        interaction.editReply({ content: `You have successfully left ${clan.value.name}!` });

        if (clan.value.members.length <= 1) {
            await clanCollection.findOneAndDelete({ members: { $eq: [] } });
        }

        let playerName = await playerCollection.findOne({ user_id: userId });
        playerName = playerName?.username;
        return playerName;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};