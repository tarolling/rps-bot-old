const ranks = require('../../../config/ranks.json');
const capitalize = require('../../utils/capitalize');
const { promotion, demotion } = require('../embeds');
const { dbUri: uri } = require('../../../config.json');

const { MongoClient, ServerApiVersion } = require('mongodb');



module.exports = async (queue, interaction) => {
    const { players } = queue;
    const guild = interaction.guild;
    const dbClient = new MongoClient(uri, {
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

        if (!winner || !loser) return;
        const winnerDoc = await collection.findOne({ user_id: winner.id });
        const loserDoc = await collection.findOne({ user_id: loser.id });

        if (!guild || !guild?.available) return;
        const winnerMember = guild.members.cache.find(m => m.id === winner.id);
        const loserMember = guild.members.cache.find(m => m.id === loser.id);

        let winnerRank = winnerDoc.rank.toLowerCase();
        let loserRank = loserDoc.rank.toLowerCase();
        const winnerThreshold = ranks[winnerRank].elo.promotion;
        const loserThreshold = ranks[loserRank].elo.demotion;

        if (winnerDoc.elo >= winnerThreshold && winnerThreshold !== null) {
            let winnerNewRank = Object.keys(ranks)[Object.keys(ranks).indexOf(winnerRank) + 1];
            await collection.updateOne({ user_id: winner.id }, { $set: { rank: capitalize(winnerNewRank), elo: ranks[winnerNewRank].elo.placement } });

            winnerNewRank = await capitalize(winnerNewRank);
            winnerRank = await capitalize(winnerRank);
            const addRole = guild.roles.cache.find(r => r.name === winnerNewRank);
            const removeRole = guild.roles.cache.find(r => r.name === winnerRank);
            const removePingRole = guild.roles.cache.find(r => r.name === `${winnerRank} Ping`);
            if (addRole) await winnerMember.roles.add(addRole);
            if (removeRole) await winnerMember.roles.remove(removeRole);
            if (removePingRole) await winnerMember.roles.remove(removePingRole);

            // const channel = guild.channels.cache.find(c => c.name === 'rank-updates');
            const channel = null;
            if (channel) await channel.send({ embeds: [promotion(winnerMember, winnerNewRank, false)] });
            await winner.send({ embeds: [promotion(winnerMember, winnerNewRank, true)] });
        }

        if (loserDoc.elo <= loserThreshold && loserThreshold !== null) {
            let loserNewRank = Object.keys(ranks)[Object.keys(ranks).indexOf(loserRank) - 1];
            await collection.updateOne({ user_id: loser.id }, { $set: { rank: capitalize(loserNewRank), elo: ranks[loserNewRank].elo.demo_placement } });

            loserNewRank = await capitalize(loserNewRank);
            loserRank = await capitalize(loserRank);
            const addRole = guild.roles.cache.find(r => r.name === loserNewRank);
            const removeRole = guild.roles.cache.find(r => r.name === loserRank);
            const removePingRole = guild.roles.cache.find(r => r.name === `${loserRank} Ping`);
            if (addRole) await loserMember.roles.add(addRole);
            if (removeRole) await loserMember.roles.remove(removeRole);
            if (removePingRole) await loserMember.roles.remove(removePingRole);

            // const channel = guild.channels.cache.find(c => c.name === 'rank-updates');
            const channel = null;
            if (channel) await channel.send({ embeds: [demotion(loserMember, loserNewRank, false)] });
            await loser.send({ embeds: [demotion(loserMember, loserNewRank, true)] });
        }
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
    }
};