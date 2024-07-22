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

    const clubName = interaction.options.getString('name');
    const clubAbbr = interaction.options.getString('abbreviation').toUpperCase();
    const clubQuery = { name: { $regex: clubName, $options: 'i' } };

    const doc = { leader: userId, name: clubName, abbreviation: clubAbbr, members: [userId] };

    try {
        await dbClient.connect();
        const clubCollection = dbClient.db('rps').collection('clubs');

        const validation = await clubCollection.findOne(clubQuery);
        if (validation) {
            interaction.editReply({ content: 'This club already exists.' }).catch(console.error);
            return;
        }

        await clubCollection.insertOne(doc);
        interaction.editReply({ content: `You have successfully created ${clubName}!` }).catch(console.error);
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};