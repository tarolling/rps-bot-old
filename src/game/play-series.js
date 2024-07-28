const { escapeUnderline } = require('discord.js');
const { findPlayer, adjustRating, adjustStats, rankValidate } = require('../db');
const { eloResult, results } = require('../embeds');
const { deleteRankQueue } = require('./manage-queues');
const playGame = require('./play-game');


module.exports = async (id, queue) => {
    let { players } = queue;
    let pOne = players[0];
    let pTwo = players[1];

    console.log(`Lobby ${id} | ${escapeUnderline(pOne.user.username)} vs. ${escapeUnderline(pTwo.user.username)}`);

    while (pOne.score < 4 && pTwo.score < 4 && pOne.score != -1 && pTwo.score != -1) {
        try {
            await playGame(id, queue);
        } catch (error) {
            console.warn(`playSeries: Unable to DM someone - ${error}`);
            break;
        }

        console.log(`L${id}-G${queue.lobbyInfo.gameNumber} | ${escapeUnderline(pOne.user.username)}: ${pOne.score} (${pOne.choice || 'DNR'}) | ${escapeUnderline(pTwo.user.username)}: ${pTwo.score} (${pTwo.choice || 'DNR'})`);

        if (!id.includes('challenge') && !(pOne.channel === null && pTwo.channel === null)) {
            const pOneEmoji = pOne.choice === 'Rock' ? ':rock:' : (pOne.choice === 'Paper' ? ':page_facing_up:' : (pOne.choice === 'Scissors' ? ':scissors:' : ':x:'));
            const pTwoEmoji = pTwo.choice === 'Rock' ? ':rock:' : (pTwo.choice === 'Paper' ? ':page_facing_up:' : (pTwo.choice === 'Scissors' ? ':scissors:' : ':x:'));

            const msg = `__**Lobby #${id} - Game ${queue.lobbyInfo.gameNumber}**__\n` +
                `${escapeUnderline(pOne.user.username)}  ${pOneEmoji}  ${pOne.score}  |  ${pTwo.score}  ${pTwoEmoji}  ${escapeUnderline(pTwo.user.username)}`;

            /* Just send one if they are the same */
            if (pOne.channel?.id === pTwo.channel?.id) {
                try {
                    await pOne.channel.send(msg);
                } catch (error) {
                    console.warn(`playSeries: Could not send results to channel ${pOne.channel.name} (${pOne.channel.id}) - ${error}`);
                }
            } else {
                if (pOne.channel !== null) {
                    try {
                        await pOne.channel.send(msg);
                    } catch (error) {
                        console.warn(`playSeries: Could not send results to channel ${pOne.channel.name} (${pOne.channel.id}) - ${error}`);
                    }
                }
                if (pTwo.channel !== null) {
                    try {
                        await pTwo.channel.send(msg);
                    } catch (error) {
                        console.warn(`playSeries: Could not send results to channel ${pTwo.channel.name} (${pTwo.channel.id}) - ${error}`);
                    }
                }
            }
        }

        if (pOne.score === -1 || pTwo.score === -1) break;

        pOne.choice = '';
        pTwo.choice = '';
    }

    if (pOne.score == -2 || pTwo.score === -2) {
        for (const player of players) {
            try {
                await player.user.send('One or more players was unable to be DMed, so the lobby has been aborted.');
            } catch (error) {
                console.warn(`playSeries: Unable to DM ${player.user.username} (${player.user.id}) - ${error}`);
            }
        }
        return deleteRankQueue(id);
    }

    if (pOne.score == -1 || pTwo.score == -1) {
        for (const player of players) {
            try {
                await player.user.send('Neither player chose an option in time, so the lobby has been aborted.');
            } catch (error) {
                console.warn(`playSeries: Unable to DM ${player.user.username} (${player.user.id}) - ${error}`);
            }
        }
        console.log(`DOUBLE AFK | Lobby ${id} | ${escapeUnderline(pOne.user.username)} vs. ${escapeUnderline(pTwo.user.username)}`);

        if (!id.includes('challenge') && !(pOne.channel === null && pTwo.channel === null)) {
            const msg = { embeds: [results(id, queue)] };

            /* Just send one if they are the same */
            if (pOne.channel?.id === pTwo.channel?.id) {
                try {
                    await pOne.channel.send(msg);
                } catch (error) {
                    console.warn(`playSeries: Could not send results to channel ${pOne.channel.name} (${pOne.channel.id}) - ${error}`);
                }
            } else {
                if (pOne.channel !== null) {
                    try {
                        await pOne.channel.send(msg);
                    } catch (error) {
                        console.warn(`playSeries: Could not send results to channel ${pOne.channel.name} (${pOne.channel.id}) - ${error}`);
                    }
                }
                if (pTwo.channel !== null) {
                    try {
                        await pTwo.channel.send(msg);
                    } catch (error) {
                        console.warn(`playSeries: Could not send results to channel ${pTwo.channel.name} (${pTwo.channel.id}) - ${error}`);
                    }
                }
            }
        }
        return deleteRankQueue(id);
    }

    for (const player of players) {
        try {
            await player.user.send({ embeds: [results(id, queue)] });
        } catch (error) {
            console.warn(`playSeries: Unable to DM ${player.user.username} (${player.user.id}) - ${error}`);
        }
    }

    if (!id.includes('challenge') && !(pOne.channel === null && pTwo.channel === null)) {
        const msg = { embeds: [results(id, queue)] };

        /* Just send one if they are the same */
        if (pOne.channel?.id === pTwo.channel?.id) {
            try {
                await pOne.channel.send(msg);
            } catch (error) {
                console.warn(`playSeries: Could not send results to channel ${pOne.channel.name} (${pOne.channel.id}) - ${error}`);
            }

        } else {
            if (pOne.channel !== null) {
                try {
                    await pOne.channel.send(msg);
                } catch (error) {
                    console.warn(`playSeries: Could not send results to channel ${pOne.channel.name} (${pOne.channel.id}) - ${error}`);
                }
            }
            if (pTwo.channel !== null) {
                try {
                    await pTwo.channel.send(msg);
                } catch (error) {
                    console.warn(`playSeries: Could not send results to channel ${pTwo.channel.name} (${pTwo.channel.id}) - ${error}`);
                }
            }
        }
    }

    console.log(`Lobby ${id} Results | ${escapeUnderline(pOne.user.username)}: ${pOne.score} | ${escapeUnderline(pTwo.user.username)}: ${pTwo.score} | Games Played: ${queue.lobbyInfo.gameNumber}`);
    if (id.includes('challenge')) return;

    if (pOne.score === 4 || pTwo.score === 4) {
        const oldElo = [];

        for (let i = 0; i < players.length; i++) {
            const oldStats = await findPlayer(players[i].user.id);
            oldElo.push(oldStats.elo);
        }

        await adjustRating(queue);
        await rankValidate(queue);
        await adjustStats(queue);

        for (let i = 0; i < players.length; i++) {
            const newStats = await findPlayer(players[i].user.id);
            try {
                await players[i].user.send({ embeds: [eloResult(players[i].user, oldElo[i], newStats.elo)] });
            } catch (error) {
                console.warn(`playSeries: Unable to DM ${players[i].user.username} (${players[i].user.id}) - ${error}`)
            }
            console.log(`${players[i].user.username} | ${oldElo[i]} --> ${newStats.elo}`);
        }

        return deleteRankQueue(id);
    }
}