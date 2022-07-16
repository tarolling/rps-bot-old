const calculateElo = require('../game/calculateElo');

const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (queue) => {
    const { players } = queue;
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const winner = players[0].score === 3 ? players[0].user : (players[1].score === 3 ? players[1].user : null);
        const loser = players[0].score === 3 ? players[1].user : (players[1].score === 3 ? players[0].user : null);

        let winnerElo, loserElo;

        await collection.findOne({ user_id: winner.id })
            .then(player => winnerElo = player.elo);
        await collection.findOne({ user_id: loser.id })
            .then(player => loserElo = player.elo);

        const incArr = calculateElo(winnerElo, loserElo);
        const p1Incr = winner === players[0].user ? incArr[0] : incArr[1];
        const p2Incr = winner === players[1].user ? incArr[0] : incArr[1];

        await collection.findOneAndUpdate({ user_id: players[0].user.id }, { $inc: { elo: p1Incr } });
        await collection.findOneAndUpdate({ user_id: players[1].user.id }, { $inc: { elo: p2Incr } });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};