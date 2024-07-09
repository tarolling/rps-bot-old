const playGame = require('./playGame');
const { eloResult, results } = require('./embeds');
const { deleteChallenge } = require('./manageQueues');
const { adjustElo, adjustStats, rankValidate } = require('../db');
const { findPlayer } = require('../db');


module.exports = async (id, queue, interaction) => {
    let { players } = queue;

    let pOne = players[0];
    let pTwo = players[1];

    console.log(`Lobby ${id} | ${pOne.user.username} vs. ${pTwo.user.username}`);

    // const resultsChannel = interaction.guild.channels.cache.find(c => c.name === 'results');
    // if (!resultsChannel) {
    //     interaction.guild.channels.create('results', { type: 'text' })
    //         .then(c => c.send({ embeds: [results(queue)] }))
    //         .catch(console.error);
    // }

    while (pOne.score < 4 && pTwo.score < 4 && pOne.score != -1 && pTwo.score != -1) {
        await playGame(id, queue);

        if (pOne.score == -1 || pTwo.score == -1) break;

        console.log(`L${id}-G${queue.lobbyInfo.gameNumber} | ${pOne.user.username}: ${pOne.score} (${pOne.choice || 'N/A'}) | ${pTwo.user.username}: ${pTwo.score} (${pTwo.choice || 'N/A'})`);
        // await resultsChannel.send({ content: `L${id}-G${queue.lobbyInfo.gameNumber} | ${pOne.user.username}: ${pOne.score} (${pOne.choice || 'N/A'}) | ${pTwo.user.username}: ${pTwo.score} (${pTwo.choice || 'N/A'})` });
        pOne.choice = '';
        pTwo.choice = '';
    }

    if (pOne.score == -1 || pTwo.score == -1) {
        pOne.user.send('Neither player chose an option in time, so the lobby has been aborted.');
        pTwo.user.send('Neither player chose an option in time, so the lobby has been aborted.');
        console.log(`DOUBLE AFK | Lobby ${id} | ${pOne.user.username} vs. ${pTwo.user.username}`);
        // await resultsChannel.send({ content: `**DOUBLE AFK** | Lobby ${id} | ${pOne.user.username} vs. ${pTwo.user.username}` });
        return;
    }

    for (const player of players) {
        await player.user.send({ embeds: [results(id, queue)] });
    }

    // await resultsChannel.send({ embeds: [results(queue)] });
    console.log(`Lobby ${id} Results | ${pOne.user.username}: ${pOne.score} | ${pTwo.user.username}: ${pTwo.score} | Games Played: ${queue.lobbyInfo.gameNumber}`);

    if (typeof id == 'string' && id.includes('challenge')) {
        await deleteChallenge(id);
        return;
    }

    if (pOne.score === 4 || pTwo.score === 4) {
        const oldElo = [];

        for (let i = 0; i < players.length; i++) {
            const oldStats = await findPlayer(players[i].user.id);
            oldElo.push(oldStats.elo);
        }

        await adjustElo(queue);
        await rankValidate(queue, interaction);
        await adjustStats(queue);

        for (let i = 0; i < players.length; i++) {
            const newStats = await findPlayer(players[i].user.id);
            await players[i].user.send({ embeds: [eloResult(queue, players[i].user, oldElo[i], newStats.elo)] });
            console.log(`${players[i].user.username} | ${oldElo[i]} --> ${newStats.elo}`);
        }
    }
}