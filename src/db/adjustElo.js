const { MongoClient, ServerApiVersion } = require('mongodb');
const calculateElo = require('../game/calculateElo');



module.exports = async (queue) => {
    const { players } = queue;
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const winner = players[0].score === 4 ? players[0].user : (players[1].score === 4 ? players[1].user : null);
        const loser = players[0].score === 4 ? players[1].user : (players[1].score === 4 ? players[0].user : null);

        let winnerElo, loserElo;

        await collection.findOne({ user_id: winner.id })
            .then(player => winnerElo = player.elo);
        await collection.findOne({ user_id: loser.id })
            .then(player => loserElo = player.elo);

        let p1Incr, p2Incr;

        // if (Object.keys(ranks).indexOf(rank) <= 2) { // If bottom 3 ranks, fixed elo
        // const incr = ranks[rank].elo.increment;
        // const decr = ranks[rank].elo.decrement;
        // p1Incr = winner === players[0].user ? incr : decr;
        // p2Incr = winner === players[1].user ? incr : decr;
        // } else { // Variable elo for other ranks
        const incArr = calculateElo(winnerElo, loserElo);
        p1Incr = winner === players[0].user ? incArr[0] : incArr[1];
        p2Incr = winner === players[1].user ? incArr[0] : incArr[1];
        // }

        await collection.findOneAndUpdate({ user_id: players[0].user.id }, { $inc: { elo: p1Incr } });
        await collection.findOneAndUpdate({ user_id: players[1].user.id }, { $inc: { elo: p2Incr } });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};