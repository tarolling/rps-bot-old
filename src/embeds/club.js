const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (club) => {
    const { name, abbreviation } = club;
    return new EmbedBuilder()
        .setTitle(name)
        .setDescription(abbreviation)
        .setFooter(footer);
};