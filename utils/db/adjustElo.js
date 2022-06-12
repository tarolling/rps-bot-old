const calculateElo = require('../calculateElo');
const rankValidate = require('./rankValidate');

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI;

module.exports = async (queue, interaction) => {
    const { game: { p1, p2 } } = queue;
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        let p1Elo, p2Elo;

        await collection.findOne({ user_id: p1.user.id })
            .then(player => p1Elo = player.elo);
        await collection.findOne({ user_id: p2.user.id })
            .then(player => p2Elo = player.elo);

        const winner = p1.score === 3 ? p1.user : (p2.score === 3 ? p2.user : null);
        const incArr = calculateElo(p1Elo, p2Elo);
        const p1Incr = winner === p1.user ? incArr[0] : incArr[1];
        const p2Incr = winner === p2.user ? incArr[0] : incArr[1];

        await collection.findOneAndUpdate({ user_id: p1.user.id }, { $inc: { elo: p1Incr } });
        await collection.findOneAndUpdate({ user_id: p2.user.id }, { $inc: { elo: p2Incr } });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }

    await rankValidate(queue, interaction);
};