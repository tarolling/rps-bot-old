const { EmbedBuilder, escapeMarkdown } = require('discord.js');
const { defaultColor, footer } = require('./embed');


module.exports = (id, queue) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle(`Lobby #${id} - Game ${gameNumber}`)
        .setDescription('Make your selection. You have 30 seconds! First to 4 wins.')
        .addFields({ name: `${players[0].score}`, value: escapeMarkdown(players[0].user.username), inline: true },
            { name: `${players[1].score}`, value: escapeMarkdown(players[1].user.username), inline: true })
        .setFooter(footer);
};