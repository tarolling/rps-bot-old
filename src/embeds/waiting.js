const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (queue, interaction) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    return new EmbedBuilder()
        .setTitle('Waiting for opponent...')
        .setDescription(`Game ${gameNumber}`)
        .addFields({ name: `${(players[0].user.id === interaction.user.id) ? players[0].choice : '???'}`, value: players[0].user.username, inline: true },
            { name: `${(players[1].user.id === interaction.user.id) ? players[1].choice : '???'}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};