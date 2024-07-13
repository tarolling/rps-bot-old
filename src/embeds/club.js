const { EmbedBuilder } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (club) => {
    const { name, abbreviation } = club;
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle(name)
        .setDescription(abbreviation)
        .setFooter(footer);
};