const { EmbedBuilder, bold, escapeMarkdown } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (id, queue) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    const winner = players[0].score > players[1].score ? players[0].user : (players[1].score > players[0].score ? players[1].user : null);
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle(`Lobby #${id} Results`)
        .setDescription(`${bold("Games Played:")} ${gameNumber}`)
        .setThumbnail(winner?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .addFields({ name: `${players[0].score}`, value: escapeMarkdown(players[0].user.username), inline: true },
            { name: `${players[1].score}`, value: escapeMarkdown(players[1].user.username), inline: true })
        .setFooter(footer);
};