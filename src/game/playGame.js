const { game, gameWin, gameLoss, gameDraw, waiting } = require('./embeds');
const logic = require('./logic');


module.exports = async (queue) => {
    const { players } = queue;
    const pOne = players[0];
    const pTwo = players[1];

    queue.lobbyInfo.gameNumber++;

    const rockBtn = {
        type: 'BUTTON',
        label: 'Rock',
        custom_id: 'Rock',
        style: 'PRIMARY',
        emoji: null,
        url: null,
        disabled: false
    };
    const paperBtn = {
        type: 'BUTTON',
        label: 'Paper',
        custom_id: 'Paper',
        style: 'PRIMARY',
        emoji: null,
        url: null,
        disabled: false
    };
    const scissorsBtn = {
        type: 'BUTTON',
        label: 'Scissors',
        custom_id: 'Scissors',
        style: 'PRIMARY',
        emoji: null,
        url: null,
        disabled: false
    };
    const row = {
        type: 'ACTION_ROW',
        components: [rockBtn, paperBtn, scissorsBtn]
    };

    // Sends the embed to the players and pushes the messages into an array for button interaction collection
    let gameMessages = [];
    let gameResults = {};
    
    await pOne.user.send({ embeds: [game(queue)], components: [row] })
        .then(msg => gameMessages.push(msg))
        .catch(() => { console.error; return; });

    await pTwo.user.send({ embeds: [game(queue)], components: [row] })
        .then(msg => gameMessages.push(msg))
        .catch(() => { console.error; return; });

    const filter = (i) => {
        return i.user.id === pOne.user.id || i.user.id === pTwo.user.id;
    };

    // Setting up message component collection
    if (gameMessages.length != 2) return;
    let prom1 = gameMessages[0].awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
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

    let prom2 = gameMessages[1].awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
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