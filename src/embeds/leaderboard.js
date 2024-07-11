const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (data) => {
    return new EmbedBuilder()
        .setTitle('Global Leaderboard')
        .addFields(data.map(({ user_id, elo }) => ({ name: `${elo}`, value: `<@${user_id}>` })))
        .setFooter(footer);
};
