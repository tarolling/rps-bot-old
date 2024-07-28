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

    const clubName = interaction.fields.getTextInputValue('club-name');
    const clubAbbr = interaction.fields.getTextInputValue('club-abbr').toUpperCase();
    const clubQuery = { name: { $regex: clubName, $options: 'i' } };

    const doc = { leader: userId, name: clubName, abbreviation: clubAbbr, members: [userId], createdAt: new Date() };

    try {
        await dbClient.connect();
        const clubCollection = dbClient.db('rps').collection('clubs');

        const validation = await clubCollection.findOne(clubQuery);
        if (validation) {
            interaction.reply({ content: 'This club already exists.', ephemeral: true }).catch(console.error);
            return;
        }

        await clubCollection.insertOne(doc);
        interaction.reply({ content: `You have successfully created ${clubName}!`, ephemeral: true }).catch(console.error);
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};