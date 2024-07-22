const { EmbedBuilder, escapeMarkdown } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (data) => {
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('Global Leaderboard')
        .addFields(data.map(({ name, abbreviation, elo }) => ({
            name: `[${escapeMarkdown(abbreviation)}] ${escapeMarkdown(name)}`,
            value: `Total Rating: ${elo}`
        })))
        .setFooter(footer);
};
