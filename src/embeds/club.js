const { EmbedBuilder, escapeMarkdown } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (club) => {
    const { name, abbreviation } = club;
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle(escapeMarkdown(name))
        .setDescription(escapeMarkdown(abbreviation))
        .setFooter(footer);
};