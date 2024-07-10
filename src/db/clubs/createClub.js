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
    const clubAbbr = interaction.options.getString('abbreviation').toUpperCase();
    const clubQuery = { name: { $regex: clubName, $options: 'i' } };

    const doc = { leader: userId, name: clubName, abbreviation: clubAbbr, members: [userId] };

    try {
        await dbClient.connect();
        const clubCollection = dbClient.db('rps').collection('clubs');
        const playerCollection = dbClient.db('rps').collection('players');

        let validation = await clubCollection.findOne(playerQuery);
        if (validation) {
            interaction.editReply({ content: `You are already part of this club -> ${validation.name}` });
            return null;
        }

        validation = await clubCollection.findOne(clubQuery);
        if (validation) {
            interaction.editReply({ content: 'This club already exists.' });
            return null;
        }

        await clubCollection.insertOne(doc);
        interaction.editReply({ content: `You have successfully created ${clubName}!` });

        let playerName = await playerCollection.findOne({ user_id: userId });
        playerName = playerName?.username;
        return (playerName) ? `[${clubAbbr}] ${playerName}` : null;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};