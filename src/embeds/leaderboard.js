const { EmbedBuilder } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (data) => {
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('Global Leaderboard')
        .addFields(data.map(({ player, elo }) => ({
            name: `${elo}`,
            value: `${player.username} (<@${player.id}>)`
        })))
        .setFooter(footer);
};
