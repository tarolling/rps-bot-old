const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (user) => {
    return new EmbedBuilder()
        .setTitle('0 players are in the queue')
        .setDescription(`**${user.username}** has left.`)
        .setThumbnail(user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .setFooter(footer);
};