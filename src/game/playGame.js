const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { game, gameWin, gameLoss, gameDraw, waiting } = require('../embeds');
const logic = require('./logic');


module.exports = async (id, queue) => {
    const { players } = queue;
    const pOne = players[0];
    const pTwo = players[1];

    queue.lobbyInfo.gameNumber++;

    const rockBtn = new ButtonBuilder()
        .setCustomId('Rock')
        .setLabel('Rock')
        .setStyle(ButtonStyle.Primary)
    const paperBtn = new ButtonBuilder()
        .setCustomId('Paper')
        .setLabel('Paper')
        .setStyle(ButtonStyle.Primary)
    const scissorsBtn = new ButtonBuilder()
        .setCustomId('Scissors')
        .setLabel('Scissors')
        .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder()
        .addComponents(rockBtn, paperBtn, scissorsBtn);

    // Sends the embed to the players and pushes the messages into an array for button interaction collection
    let gameMessages = [];
    let gameResults = {};

    let msgOne, msgTwo;

    try {
        msgOne = await pOne.user.send({ embeds: [game(id, queue)], components: [row] });
    } catch {
        pOne.score = -2;
        throw new Error(`${pOne.user.username} (${pOne.user.id})`);
    }

    try {
        msgTwo = await pTwo.user.send({ embeds: [game(id, queue)], components: [row] });
    } catch {
        pTwo.score = -2;
        throw new Error(`${pTwo.user.username} (${pTwo.user})`);
    }

    gameMessages.push(msgOne);
    gameMessages.push(msgTwo);

    const pOneFilter = i => i.user.id === pOne.user.id;
    const pTwoFilter = i => i.user.id === pTwo.user.id;

    /* Setting up message component collection */
    if (gameMessages.length != 2) return;
    let prom1 = gameMessages[0].awaitMessageComponent({ pOneFilter, time: 30_000 })
        .then(async (i) => {
            i.deferUpdate();
            pOne.choice = i.customId;
            gameMessages[0].edit({ components: [] }).catch(console.error);
            let msg;
            try {
                msg = await pOne.user.send({ embeds: [waiting(queue, i)] });
            } catch {
                pOne.score = -2;
                throw new Error(`${pOne.user.username} (${pOne.user.id})`);
            }
            return msg;
        })
        .then(msg => gameResults.pOneMsg = msg)
        .catch(() => {
            gameMessages[0].edit({ components: [] }).catch(console.error);
        });

    let prom2 = gameMessages[1].awaitMessageComponent({ pTwoFilter, time: 30_000 })
        .then(async (i) => {
            i.deferUpdate();
            pTwo.choice = i.customId;
            gameMessages[1].edit({ components: [] }).catch(console.error);
            let msg;
            try {
                msg = await pTwo.user.send({ embeds: [waiting(queue, i)] });
            } catch {
                pTwo.score = -2;
                throw new Error(`${pTwo.user.username} (${pTwo.user})`);
            }
            return msg;
        })
        .then(msg => gameResults.pTwoMsg = msg)
        .catch(() => {
            gameMessages[1].edit({ components: [] }).catch(console.error);
        });

    /* Awaiting the players to make their choices */
    let promises = [prom1, prom2];
    /* TODO: Determine who chose and who didn't by result of this result */
    await Promise.allSettled(promises);

    /* Calculating the winner */
    if (pOne.choice || pTwo.choice) {
        /* Either player respond */
        const winner = await logic(pOne.choice, pTwo.choice);
        switch (winner) {
            case 'p1': {
                if (gameResults.pOneMsg) {
                    gameResults.pOneMsg.edit({ embeds: [gameWin(queue)] }).catch(console.error);
                } else {
                    try {
                        await pOne.user.send({ embeds: [gameWin(queue)] });
                    } catch {
                        pOne.score = -2;
                        throw new Error(`${pOne.user.username} (${pOne.user.id})`);
                    }
                }
                if (gameResults.pTwoMsg) {
                    gameResults.pTwoMsg.edit({ embeds: [gameLoss(queue)] }).catch(console.error);
                } else {
                    try {
                        await pTwo.user.send({ embeds: [gameLoss(queue)] });
                    } catch {
                        pTwo.score = -2;
                        throw new Error(`${pTwo.user.username} (${pTwo.user})`);
                    }
                }
                pOne.score++;
                break;
            }
            case 'p2': {
                if (gameResults.pOneMsg) {
                    gameResults.pOneMsg.edit({ embeds: [gameLoss(queue)] }).catch(console.error);
                } else {
                    try {
                        await pOne.user.send({ embeds: [gameLoss(queue)] });
                    } catch {
                        pOne.score = -2;
                        throw new Error(`${pOne.user.username} (${pOne.user.id})`);
                    }
                }
                if (gameResults.pTwoMsg) {
                    gameResults.pTwoMsg.edit({ embeds: [gameWin(queue)] }).catch(console.error);
                } else {
                    try {
                        await pTwo.user.send({ embeds: [gameWin(queue)] });
                    } catch {
                        pTwo.score = -2;
                        throw new Error(`${pTwo.user.username} (${pTwo.user})`);
                    }
                }
                pTwo.score++;
                break;
            }
            case 'draw': {
                gameResults.pOneMsg.edit({ embeds: [gameDraw(queue)] }).catch(console.error);
                gameResults.pTwoMsg.edit({ embeds: [gameDraw(queue)] }).catch(console.error);
                break;
            }
        }
    } else {
        /* No player responds */
        pOne.score = -1;
        pTwo.score = -1;
    }
};