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

    const clubName = interaction.options.getString('name');
    const clubQuery = { name: { $regex: clubName, $options: 'i' } };

    try {
        await dbClient.connect();
        const clubCollection = dbClient.db('rps').collection('clubs');

        let validation = await clubCollection.findOne(playerQuery);
        if (validation) {
            interaction.editReply({ content: `You are already a member of ${validation.name}!` });
            return;
        }

        validation = await clubCollection.findOneAndUpdate(clubQuery, { $push: playerQuery });
        if (!validation) {
            interaction.editReply({ content: 'This club does not exist.' });
            return;
        }

        interaction.editReply({ content: `You have successfully joined ${validation.name}!` });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};