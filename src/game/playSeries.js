const { findPlayer, adjustElo, adjustStats, rankValidate } = require('../db');
const { eloResult, results } = require('../embeds');
const { deleteRankQueue, deleteChallenge } = require('./manageQueues');
const playGame = require('./playGame');


module.exports = async (id, queue) => {
    let { players } = queue;
    let pOne = players[0];
    let pTwo = players[1];

    console.log(`Lobby ${id} | ${pOne.user.username} vs. ${pTwo.user.username}`);

    while (pOne.score < 4 && pTwo.score < 4 && pOne.score != -1 && pTwo.score != -1) {
        await playGame(id, queue);

        console.log(`L${id}-G${queue.lobbyInfo.gameNumber} | ${pOne.user.username}: ${pOne.score} (${pOne.choice || 'DNR'}) | ${pTwo.user.username}: ${pTwo.score} (${pTwo.choice || 'DNR'})`);

        if (!id.includes('challenge') && !(pOne.channel === null && pTwo.channel === null)) {
            const pOneEmoji = pOne.choice === 'Rock' ? ':rock:' : (pOne.choice === 'Paper' ? ':page_facing_up:' : (pOne.choice === 'Scissors' ? ':scissors:' : ':x:'));
            const pTwoEmoji = pTwo.choice === 'Rock' ? ':rock:' : (pTwo.choice === 'Paper' ? ':page_facing_up:' : (pTwo.choice === 'Scissors' ? ':scissors:' : ':x:'));

            const msg = `__**Lobby #${id} - Game ${queue.lobbyInfo.gameNumber}**__\n` +
                `${pOne.user.username}  ${pOneEmoji}  ${pOne.score}  |  ${pTwo.score}  ${pTwoEmoji}  ${pTwo.user.username}`;

            /* Just send one if they are the same */
            if (pOne.channel?.id === pTwo.channel?.id) {
                pOne.channel.send(msg);
            } else {
                if (pOne.channel !== null) pOne.channel.send(msg);
                if (pTwo.channel !== null) pTwo.channel.send(msg);
            }
        }

        if (pOne.score === -1 || pTwo.score === -1) break;

        pOne.choice = '';
        pTwo.choice = '';
    }

    if (pOne.score == -1 || pTwo.score == -1) {
        for (const player of players) {
            player.user.send('Neither player chose an option in time, so the lobby has been aborted.');
        }
        console.log(`DOUBLE AFK | Lobby ${id} | ${pOne.user.username} vs. ${pTwo.user.username}`);

        if (!id.includes('challenge') && !(pOne.channel === null && pTwo.channel === null)) {
            const msg = { embeds: [results(id, queue)] };

            /* Just send one if they are the same */
            if (pOne.channel?.id === pTwo.channel?.id) {
                pOne.channel.send(msg);
            } else {
                if (pOne.channel !== null) pOne.channel.send(msg);
                if (pTwo.channel !== null) pTwo.channel.send(msg);
            }
        }
        return;
    }

    for (const player of players) {
        await player.user.send({ embeds: [results(id, queue)] });
    }

    if (!id.includes('challenge') && !(pOne.channel === null && pTwo.channel === null)) {
        const msg = { embeds: [results(id, queue)] };

        /* Just send one if they are the same */
        if (pOne.channel?.id === pTwo.channel?.id) {
            pOne.channel.send(msg);
        } else {
            if (pOne.channel !== null) pOne.channel.send(msg);
            if (pTwo.channel !== null) pTwo.channel.send(msg);
        }
    }

    console.log(`Lobby ${id} Results | ${pOne.user.username}: ${pOne.score} | ${pTwo.user.username}: ${pTwo.score} | Games Played: ${queue.lobbyInfo.gameNumber}`);

    if (typeof id == 'string' && id.includes('challenge')) {
        return deleteChallenge(id);
    }

    if (pOne.score === 4 || pTwo.score === 4) {
        const oldElo = [];

        for (let i = 0; i < players.length; i++) {
            const oldStats = await findPlayer(players[i].user.id);
            oldElo.push(oldStats.elo);
        }

        await adjustElo(queue);
        await rankValidate(queue);
        await adjustStats(queue);

        for (let i = 0; i < players.length; i++) {
            const newStats = await findPlayer(players[i].user.id);
            await players[i].user.send({ embeds: [eloResult(players[i].user, oldElo[i], newStats.elo)] });
            console.log(`${players[i].user.username} | ${oldElo[i]} --> ${newStats.elo}`);
        }

        return deleteRankQueue(id);
    }

    return deleteRankQueue(id);
}