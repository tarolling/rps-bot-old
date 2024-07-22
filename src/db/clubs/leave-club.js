const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (interaction) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });
    const userId = interaction.user.id;
    const playerQuery = { members: userId };

    try {
        await dbClient.connect();
        const clubCollection = dbClient.db('rps').collection('clubs');

        let club = await clubCollection.findOne(playerQuery);
        if (!club) {
            interaction.editReply({ content: 'You are not a part of any club.', ephemeral: true }).catch(console.error);
            return;
        }

        const leaderCheck = await clubCollection.findOne({ leader: userId });
        if (leaderCheck) {
            if (club.members.length !== 1) {
                interaction.editReply({
                    content: 'You cannot leave a club that you are a leader of, and that has other members in it.',
                    ephemeral: true
                }).catch(console.error);
                return;
            }
            club = await clubCollection.findOneAndDelete({ _id: club._id });
        } else {
            club = await clubCollection.findOneAndUpdate(playerQuery, { $pull: playerQuery });
        }

        interaction.editReply({ content: `You have successfully left ${club.name}!` }).catch(console.error);
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};