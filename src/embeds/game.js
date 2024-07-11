const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (id, queue) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    return new EmbedBuilder()
        .setTitle(`Lobby #${id} - Game ${gameNumber}`)
        .setDescription('Make your selection. You have 30 seconds! First to 4 wins.')
        .addFields({ name: `${players[0].score}`, value: players[0].user.username, inline: true },
            { name: `${players[1].score}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};