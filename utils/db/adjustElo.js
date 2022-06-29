const calculateElo = require('../calculateElo');

const MongoClient = require('mongodb').MongoClient;
// eslint-disable-next-line
const uri = process.env.DB_URI;

module.exports = async (queue) => {
    const { game: { p1, p2 } } = queue;
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        let winner, loser;

        if (p1.score === 3) {
            winner = p1.user;
            loser = p2.user;
        } else {
            winner = p2.user;
            loser = p1.user;
        }

        let winnerElo, loserElo;

        await collection.findOne({ user_id: winner.id })
            .then(player => winnerElo = player.elo);
        await collection.findOne({ user_id: loser.id })
            .then(player => loserElo = player.elo);

        const incArr = calculateElo(winnerElo, loserElo);
        const p1Incr = winner === p1.user ? incArr[0] : incArr[1];
        const p2Incr = winner === p2.user ? incArr[0] : incArr[1];

        await collection.findOneAndUpdate({ user_id: p1.user.id }, { $inc: { elo: p1Incr } });
        await collection.findOneAndUpdate({ user_id: p2.user.id }, { $inc: { elo: p2Incr } });
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};