const playGame = require('./playGame');
const capitalize = require('../misc/capitalize');
const ranks = require('../../config/ranks.json');
const { eloResult, results } = require('./embeds');
const { adjustElo, adjustStats, findPlayer, rankValidate } = require('../db');


module.exports = async (queue, interaction) => {
    let { players, lobbyInfo: { gameNumber, id, rank } } = queue;

    let pOne = players[0];
    let pTwo = players[1];

    console.log(`Lobby ${id} | ${capitalize(rank)} | ${pOne.user.username} vs. ${pTwo.user.username}`);

    const resultsChannel = interaction.guild.channels.cache.find(c => c.name === 'results');
    if (!resultsChannel) {
        interaction.guild.channels.create('results', { type: 'text' })
            .then(c => c.send({ embeds: [results(queue)] }))
            .catch(console.error);
    }

    while (pOne.score < 3 && pTwo.score < 3 && pOne.score != -1 && pTwo.score != -1) {
        // eslint-disable-next-line no-unused-vars
        gameNumber++;
        await playGame(queue);

        if (pOne.score == -1 || pTwo.score == -1) {
            pOne.user.send('Neither player chose an option in time, so the lobby has been aborted.');
            pTwo.user.send('Neither player chose an option in time, so the lobby has been aborted.');
            console.log(`DOUBLE AFK | Lobby ${id} | ${capitalize(rank)} | ${pOne.user.username} vs. ${pTwo.user.username}`);
            await resultsChannel.send({ content: `**DOUBLE AFK** | Lobby ${id} | ${capitalize(rank)} | ${pOne.user.username} vs. ${pTwo.user.username}`});
            return;
        }

        console.log(`L${id}-G${queue.lobbyInfo.gameNumber} | ${pOne.user.username}: ${pOne.score} (${pOne.choice || 'N/A'}) | ${pTwo.user.username}: ${pTwo.score} (${pTwo.choice || 'N/A'})`);
        await resultsChannel.send({ content: `L${id}-G${queue.lobbyInfo.gameNumber} | ${pOne.user.username}: ${pOne.score} (${pOne.choice || 'N/A'}) | ${pTwo.user.username}: ${pTwo.score} (${pTwo.choice || 'N/A'})` });
        pOne.choice = '';
        pTwo.choice = '';
    }

    // Finish up

    for (const player of players) {
        await player.user.send({ embeds: [results(queue)] });
    }

    await resultsChannel.send({ embeds: [results(queue)] });
    console.log(`Lobby ${id} Results | ${pOne.user.username}: ${pOne.score} | ${pTwo.user.username}: ${pTwo.score} | Games Played: ${queue.lobbyInfo.gameNumber}`);
    
    if (Object.keys(ranks).includes(rank) && (pOne.score === 3 || pTwo.score === 3)) {
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