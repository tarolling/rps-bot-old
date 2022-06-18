const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;

module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const playerQuery = { members: interaction.user.id };

    const clanName = interaction.options.getString('clan_name');
    const clanQuery = { name: { $regex: clanName, $options: 'i' } };

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('clans');

        let validation = await collection.findOne(playerQuery);
        if (validation) {
            interaction.editReply({ content: `You are already part of this clan -> ${validation.name}` });
            return null;
        }

        validation = await collection.findOneAndUpdate(clanQuery, { $push: { members: interaction.user.id } });
        if (!validation.value) {
            interaction.editReply({ content: 'This clan does not exist.' });
            return null;
        }
        
        interaction.editReply({ content: `You have successfully joined ${validation.value.name}!` });
        return validation.value.name;
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};