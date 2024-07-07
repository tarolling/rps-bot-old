const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const userId = interaction.user.id;
    const playerQuery = { members: userId };


    try {
        await dbClient.connect();
        const clubCollection = dbClient.db('rps').collection('clubs');
        const playerCollection = dbClient.db('rps').collection('players');

        let club = await clubCollection.findOneAndUpdate(playerQuery, { $pull: playerQuery });
        if (!club) {
            interaction.editReply({ content: `You are not a part of any club.` });
            return null;
        }

        interaction.editReply({ content: `You have successfully left ${club.value.name}!` });

        if (club.value.members.length <= 1) {
            await clubCollection.findOneAndDelete({ members: { $eq: [] } });
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