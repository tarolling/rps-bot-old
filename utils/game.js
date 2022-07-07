const { adjustStats, adjustElo, rankValidate, findPlayer } = require('./db');
const { eloResult, game, gameWin, gameLoss, gameDraw, results, waiting } = require('./embeds');
const logic = require('./logic');
const ranks = require('../config/ranks.json');
const capitalize = require('./capitalize');


module.exports = async (queue, interaction) => {
    let { players, game: { p1, p2 }, lobby: { id, rank } } = queue;
    p1.user = players[0];
    p2.user = players[1];

    const resultsChannel = interaction.guild.channels.cache.find(c => c.name === 'results');
    if (!resultsChannel) {
        interaction.guild.channels.create('results', { type: 'text' })
            .then(c => c.send({ embeds: [results(queue)] }))
            .catch(console.error);
    }

    console.log(`Lobby ${id} | ${capitalize(rank)} | ${p1.user.username} vs. ${p2.user.username}`);

    while (p1.score < 3 && p2.score < 3) {
        queue.game.number++;

        let rockBtn = {
            type: 'BUTTON',
            label: 'Rock',
            custom_id: 'Rock',
            style: 'PRIMARY',
            emoji: null,
            url: null,
            disabled: false
        };
        let paperBtn = {
            type: 'BUTTON',
            label: 'Paper',
            custom_id: 'Paper',
            style: 'PRIMARY',
            emoji: null,
            url: null,
            disabled: false
        };
        let scissorsBtn = {
            type: 'BUTTON',
            label: 'Scissors',
            custom_id: 'Scissors',
            style: 'PRIMARY',
            emoji: null,
            url: null,
            disabled: false
        };
        let row = {
            type: 'ACTION_ROW',
            components: [rockBtn, paperBtn, scissorsBtn]
        };

        // Sends the embed to the players and pushes the messages into an array for button interaction collection
        let gameMessages = [];
        let gameResults = {};
        
        await p1.user.send({ embeds: [game(queue)], components: [row] })
            .then(msg => gameMessages.push(msg))
            .catch(console.error);

        await p2.user.send({ embeds: [game(queue)], components: [row] })
            .then(msg => gameMessages.push(msg))
            .catch(console.error);

        const filter = (i) => {
            i.deferUpdate();
            return i.user.id === p1.user.id || i.user.id === p2.user.id;
        };

        // Setting up message component collection
        if (gameMessages.length != 2) continue;
        let prom1 = gameMessages[0].awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
            .then((i) => {
                p1.choice = i.customId;
                rockBtn.disabled = true;
                paperBtn.disabled = true;
                scissorsBtn.disabled = true;
                row.components = [rockBtn, paperBtn, scissorsBtn];
                gameMessages[0].edit({ components: [row] });
                return p1.user.send({ embeds: [waiting(queue, i)] });
            })
            .then(msg => gameResults.p1msg = msg);
        let prom2 = gameMessages[1].awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
            .then((i) => {
                p2.choice = i.customId;
                rockBtn.disabled = true;
                paperBtn.disabled = true;
                scissorsBtn.disabled = true;
                row.components = [rockBtn, paperBtn, scissorsBtn];
                gameMessages[1].edit({ components: [row] });
                return p2.user.send({ embeds: [waiting(queue, i)] });
            })
            .then(msg => gameResults.p2msg = msg);
        
        // Awaiting the players to make their choices
        let promises = [prom1, prom2];
        await Promise.allSettled(promises);

        // Calculating the winner
        if (p1.choice || p2.choice) { // If either player respond
            let winner = logic(p1.choice, p2.choice);
            switch (winner) {
                case 'p1': {
                    (gameResults.p1msg) ? gameResults.p1msg.edit({ embeds: [gameWin(queue)] })
                        : p1.user.send({ embeds: [gameWin(queue)] });
                    (gameResults.p2msg) ? gameResults.p2msg.edit({ embeds: [gameLoss(queue)] })
                        : p2.user.send({ embeds: [gameLoss(queue)] });
                    p1.score++;
                    break;
                }
                case 'p2': {
                    (gameResults.p1msg) ? gameResults.p1msg.edit({ embeds: [gameLoss(queue)] })
                        : p1.user.send({ embeds: [gameLoss(queue)] });
                    (gameResults.p2msg) ? gameResults.p2msg.edit({ embeds: [gameWin(queue)] })
                        : p2.user.send({ embeds: [gameWin(queue)] });
                    p2.score++;
                    break;
                }
                case 'draw': {
                    gameResults.p1msg.edit({ embeds: [gameDraw(queue)] });
                    gameResults.p2msg.edit({ embeds: [gameDraw(queue)] });
                    break;
                }
            }

            console.log(`L${id}-G${queue.game.number} | ${p1.user.username}: ${p1.score} (${p1.choice || 'N/A'}) | ${p2.user.username}: ${p2.score} (${p2.choice || 'N/A'})`);
            resultsChannel.send({ content: `L${id}-G${queue.game.number} | ${p1.user.username}: ${p1.score} (${p1.choice || 'N/A'}) | ${p2.user.username}: ${p2.score} (${p2.choice || 'N/A'})` });
            p1.choice = '';
            p2.choice = '';

        } else { // If no player responds
            p1.user.send('Neither player chose an option in time, so the lobby has been aborted.');
            p2.user.send('Neither player chose an option in time, so the lobby has been aborted.');
            console.log(`L${id}-G${queue.game.number} | ${p1.user.username}: ${p1.score} (N/A) | ${p2.user.username}: ${p2.score} (N/A)`);
            resultsChannel.send({ content: `L${id}-G${queue.game.number} | ${p1.user.username}: ${p1.score} (N/A) | ${p2.user.username}: ${p2.score} (N/A)` });
            break;
        }
    }

    for (const user of players) {
        user.send({ embeds: [results(queue)] });
    }

    await resultsChannel.send({ embeds: [results(queue)] });
    console.log(`Lobby ${id} Results | ${p1.user.username}: ${p1.score} | ${p2.user.username}: ${p2.score} | Games Played: ${queue.game.number}`);
    
    if (Object.keys(ranks).includes(rank) && (p1.score === 3 || p2.score === 3)) {
        const oldElo = [];

        for (let i = 0; i < players.length; i++) {
            const oldStats = await findPlayer(players[i].id);
            oldElo.push(oldStats.elo);
        }
        
        await adjustElo(queue);
        await rankValidate(queue, interaction);
        await adjustStats(queue);

        for (let i = 0; i < players.length; i++) {
            const newStats = await findPlayer(players[i].id);
            await players[i].send({ embeds: [eloResult(queue, players[i], oldElo[i], newStats.elo)] });
            console.log(`${p1.user.username} is now at ${newStats.elo} from ${oldElo[i]}`);
        }
    }
};