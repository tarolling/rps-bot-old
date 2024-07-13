const { EmbedBuilder } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (data) => {
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('Global Leaderboard')
        .addFields(data.map(({ user_id, elo }) => ({ name: `${elo}`, value: `<@${user_id}>` })))
        .setFooter(footer);
};
