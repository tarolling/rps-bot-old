const { EmbedBuilder, escapeMarkdown } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (clubs) => {
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('List of Clubs')
        .addFields(clubs.map(({ name, abbreviation, members }) => ({
            name: `[${escapeMarkdown(abbreviation)}] ${escapeMarkdown(name)}`,
            value: `Members: ${members}`
        })))
        .setFooter(footer);
}