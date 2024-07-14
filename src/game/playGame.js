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
        msgTwo = await pTwo.user.send({ embeds: [game(id, queue)], components: [row] });
    } catch (error) {
        if (!id.includes('challenge') && !(pOne.channel === null && pTwo.channel === null)) {
            const msg = `Lobby ${id} aborted - ` +
                'One or both players have DMs from server members turned off. Please enable them in your Discord settings.';
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

    gameMessages.push(msgOne);
    gameMessages.push(msgTwo);

    const pOneFilter = i => i.user.id === pOne.user.id;
    const pTwoFilter = i => i.user.id === pTwo.user.id;

    // Setting up message component collection
    if (gameMessages.length != 2) return;
    let prom1 = gameMessages[0].awaitMessageComponent({ pOneFilter, time: 30000 })
        .then((i) => {
            i.deferUpdate();
            pOne.choice = i.customId;
            gameMessages[0].edit({ components: [] });
            return pOne.user.send({ embeds: [waiting(queue, i)] });
        })
        .then(msg => gameResults.pOneMsg = msg)
        .catch(() => {
            gameMessages[0].edit({ components: [] });
        });

    let prom2 = gameMessages[1].awaitMessageComponent({ pTwoFilter, time: 30000 })
        .then((i) => {
            i.deferUpdate();
            pTwo.choice = i.customId;
            gameMessages[1].edit({ components: [] });
            return pTwo.user.send({ embeds: [waiting(queue, i)] });
        })
        .then(msg => gameResults.pTwoMsg = msg)
        .catch(() => {
            gameMessages[1].edit({ components: [] });
        });

    // Awaiting the players to make their choices
    let promises = [prom1, prom2];
    await Promise.allSettled(promises);

    // Calculating the winner
    if (pOne.choice || pTwo.choice) { // If either player respond
        let winner = await logic(pOne.choice, pTwo.choice);
        switch (winner) {
            case 'p1': {
                (gameResults.pOneMsg) ? gameResults.pOneMsg.edit({ embeds: [gameWin(queue)] })
                    : pOne.user.send({ embeds: [gameWin(queue)] });
                (gameResults.pTwoMsg) ? gameResults.pTwoMsg.edit({ embeds: [gameLoss(queue)] })
                    : pTwo.user.send({ embeds: [gameLoss(queue)] });
                pOne.score++;
                break;
            }
            case 'p2': {
                (gameResults.pOneMsg) ? gameResults.pOneMsg.edit({ embeds: [gameLoss(queue)] })
                    : pOne.user.send({ embeds: [gameLoss(queue)] });
                (gameResults.pTwoMsg) ? gameResults.pTwoMsg.edit({ embeds: [gameWin(queue)] })
                    : pTwo.user.send({ embeds: [gameWin(queue)] });
                pTwo.score++;
                break;
            }
            case 'draw': {
                gameResults.pOneMsg.edit({ embeds: [gameDraw(queue)] });
                gameResults.pTwoMsg.edit({ embeds: [gameDraw(queue)] });
                break;
            }
        }
    } else { // If no player responds
        pOne.score = -1;
        pTwo.score = -1;
    }
};