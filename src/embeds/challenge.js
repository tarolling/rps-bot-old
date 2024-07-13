const { EmbedBuilder } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (interaction) => {
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('New Challenger Approaching')
        .setDescription(`**${interaction.user.username}** has challenged you to a game of RPS!`)
        .setFooter(footer);
};