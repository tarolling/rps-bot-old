const { MongoClient, ServerApiVersion } = require('mongodb');
const { promotion, demotion } = require('../embeds');
const ranks = require('../../config/ranks.json');


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

        if (!winner || !loser) return;
        const winnerDoc = await collection.findOne({ user_id: winner.id });
        const loserDoc = await collection.findOne({ user_id: loser.id });

        let winnerRank = winnerDoc.rank.toLowerCase();
        let loserRank = loserDoc.rank.toLowerCase();
        const winnerThreshold = ranks[winnerRank].elo.promotion;
        const loserThreshold = ranks[loserRank].elo.demotion;

        if (winnerDoc.elo >= winnerThreshold && winnerThreshold !== null) {
            let winnerNewRank = Object.keys(ranks)[Object.keys(ranks).indexOf(winnerRank) + 1];
            await collection.updateOne({ user_id: winner.id },
                {
                    $set: {
                        rank: winnerNewRank.charAt(0).toUpperCase() + winnerNewRank.slice(1),
                        elo: ranks[winnerNewRank].elo.placement
                    }
                });

            winnerNewRank = winnerNewRank.charAt(0).toUpperCase() + winnerNewRank.slice(1);
            winnerRank = winnerRank.charAt(0).toUpperCase() + winnerRank.slice(1);
            await winner.send({ embeds: [promotion(winner, winnerNewRank)] });
        }

        if (loserDoc.elo <= loserThreshold && loserThreshold !== null) {
            let loserNewRank = Object.keys(ranks)[Object.keys(ranks).indexOf(loserRank) - 1];
            await collection.updateOne({ user_id: loser.id },
                {
                    $set: {
                        rank: loserNewRank.charAt(0).toUpperCase() + loserNewRank.slice(1),
                        elo: ranks[loserNewRank].elo.demo_placement
                    }
                });

            loserNewRank = loserNewRank.charAt(0).toUpperCase() + loserNewRank.slice(1);
            loserRank = loserRank.charAt(0).toUpperCase() + loserRank.slice(1);

            await loser.send({ embeds: [demotion(loser, loserNewRank)] });
        }
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};