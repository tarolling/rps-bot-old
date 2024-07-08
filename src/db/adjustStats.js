const { MongoClient, ServerApiVersion } = require('mongodb');


module.exports = async (queue) => {
    const { players } = queue;
    const dbClient = new MongoClient(process.env.DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await dbClient.connect();
        const collection = dbClient.db('rps').collection('players');

        const winner = players[0].score === 4 ? players[0].user : (players[1].score === 4 ? players[1].user : null);
        const loser = players[0].score === 4 ? players[1].user : (players[1].score === 4 ? players[0].user : null);

        const winnerDoc = await collection.findOne({ user_id: winner.id });
        const loserDoc = await collection.findOne({ user_id: loser.id });

        const winnerNewDoc = {
            $inc: {
                career_games: 1,
                career_wins: 1,
                season_games: 1,
                season_wins: 1,
                current_streak: 1
            },
            $set: {
                career_win_pct: Math.round(((winnerDoc.career_wins + 1) / (winnerDoc.career_games + 1)) * 100),
                season_win_pct: Math.round(((winnerDoc.season_wins + 1) / (winnerDoc.season_games + 1)) * 100),
            }
        };
        const loserNewDoc = {
            $inc: {
                career_games: 1,
                career_losses: 1,
                season_games: 1,
                season_losses: 1,
            },
            $set: {
                career_win_pct: Math.round((loserDoc.career_wins / (loserDoc.career_games + 1)) * 100),
                season_win_pct: Math.round((loserDoc.season_wins / (loserDoc.season_games + 1)) * 100),
                current_streak: 0,
            }
        };
        // comparing stats to updated stats
        if ((winnerDoc.current_streak + 1) > winnerDoc.longest_streak) {
            winnerNewDoc.$set.longest_streak = winnerDoc.current_streak + 1;
        }
        if (winnerDoc.elo > winnerDoc.season_peak_elo) {
            winnerNewDoc.$set.season_peak_elo = winnerDoc.elo;
        }
        if (winnerDoc.elo > winnerDoc.career_peak_elo) {
            winnerNewDoc.$set.career_peak_elo = winnerDoc.elo;
        }

        await collection.findOneAndUpdate({ user_id: winner.id }, winnerNewDoc);
        await collection.findOneAndUpdate({ user_id: loser.id }, loserNewDoc);
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};