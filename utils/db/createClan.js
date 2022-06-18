const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;

module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const playerQuery = { members: interaction.user.id };

    const clanName = interaction.options.getString('clan_name');
    const clanQuery = { name: { $regex: clanName, $options: 'i' } };

    const doc = { name: clanName, members: [interaction.user.id] };

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('clans');

        let validation = await collection.findOne(playerQuery);
        if (validation) {
            interaction.editReply({ content: `You are already part of this clan -> ${validation.name}` });
            return null;
        }

        validation = await collection.findOne(clanQuery);
        if (validation) {
            interaction.editReply({ content: 'This clan already exists.' });
            return null;
        }

        await collection.insertOne(doc);
        interaction.editReply({ content: `You have successfully created ${clanName}!` });
        return clanName;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};