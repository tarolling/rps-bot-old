const { EmbedBuilder, escapeMarkdown } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (queue, interaction) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('Waiting for opponent...')
        .setDescription(`Game ${gameNumber}`)
        .addFields({ name: `${(players[0].user.id === interaction.user.id) ? players[0].choice : '???'}`, value: escapeMarkdown(players[0].user.username), inline: true },
            { name: `${(players[1].user.id === interaction.user.id) ? players[1].choice : '???'}`, value: escapeMarkdown(players[1].user.username), inline: true })
        .setFooter(footer);
};