const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (queue) => {
    const { players } = queue;
    return new EmbedBuilder()
        .setTitle('RPS Status')
        .setDescription(`Player in queue: <@!${players[0].user.id}>`)
        .setFooter(footer);
};