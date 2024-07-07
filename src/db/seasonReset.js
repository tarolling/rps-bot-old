const { seasonResetValues } = require('./values');

const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (interaction) => {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const update = seasonResetValues();

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        await collection.updateMany({}, update);
        return interaction.editReply({ content: 'All users have been reset.', ephemeral: true });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};