const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (interaction) => {
    return new EmbedBuilder()
        .setTitle('New Challenger Approaching')
        .setDescription(`**${interaction.user.username}** has challenged you to a game of RPS!`)
        .setFooter(footer);
};