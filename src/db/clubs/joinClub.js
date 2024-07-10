const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (interaction) => {
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const userId = interaction.user.id;
    const playerQuery = { members: userId };

    const clubName = interaction.options.getString('club_name');
    const clubQuery = { name: { $regex: clubName, $options: 'i' } };

    try {
        await dbClient.connect();
        const clubCollection = dbClient.db('rps').collection('clubs');
        const playerCollection = dbClient.db('rps').collection('players');

        let validation = await clubCollection.findOne(playerQuery);
        if (validation) {
            interaction.editReply({ content: `You are already part of this club -> ${validation.name}` });
            return null;
        }

        validation = await clubCollection.findOneAndUpdate(clubQuery, { $push: playerQuery });
        if (!validation.value) {
            interaction.editReply({ content: 'This club does not exist.' });
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