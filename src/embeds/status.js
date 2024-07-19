const { EmbedBuilder, userMention, escapeMarkdown } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (queue) => {
    const { players } = queue;
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('RPS Status')
        .setDescription(`Player in queue: ${escapeMarkdown(players[0].user.username)} (${userMention(players[0].user.id)})`)
        .setFooter(footer);
};