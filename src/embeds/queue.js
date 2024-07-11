const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (queue, user) => {
    const { players } = queue;
    let embed = new EmbedBuilder()
        .setTitle(`${players.length} player${players.length === 1 ? ' is' : 's are'} in the queue`)
        .setDescription(`**${user.username}** has joined.`)
        .setThumbnail(user?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .setFooter(footer);
    return (players.length === 1) ? embed.addFields({ name: 'Want to join?', value: 'Type `/q` to join this lobby!' }) : embed;
};