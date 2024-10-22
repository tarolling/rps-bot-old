const { EmbedBuilder, userMention, escapeMarkdown } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (data) => {
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('Global Leaderboard')
        .addFields(data.map(({ player, elo }) => ({
            name: `${elo}`,
            value: `${escapeMarkdown(player.username)} (${userMention(player.id)})`
        })))
        .setFooter(footer);
};
