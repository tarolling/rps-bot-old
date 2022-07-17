const calculateElo = require('../calculateElo');
const ranks = require('../../../config/ranks.json');

const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;


module.exports = async (queue) => {
    const { players, lobbyInfo: { rank } } = queue;
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

        let p1Incr, p2Incr;

        if (Object.keys(ranks).indexOf(rank) <= 2) { // If bottom 3 ranks, fixed elo
            const incr = ranks[rank].elo.increment;
            const decr = ranks[rank].elo.decrement;
            p1Incr = winner === players[0].user ? incr : decr;
            p2Incr = winner === players[1].user ? incr : decr;
        } else { // Variable elo for other ranks
            const incArr = calculateElo(winnerElo, loserElo);
            p1Incr = winner === players[0].user ? incArr[0] : incArr[1];
            p2Incr = winner === players[1].user ? incArr[0] : incArr[1];
        }

        await collection.findOneAndUpdate({ user_id: players[0].user.id }, { $inc: { elo: p1Incr } });
        await collection.findOneAndUpdate({ user_id: players[1].user.id }, { $inc: { elo: p2Incr } });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};