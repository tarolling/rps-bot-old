const { EmbedBuilder } = require('discord.js');
const { footer } = require('./embed');
const ranks = require('../../config/ranks.json');

module.exports = (user, rank) => {
    const color = (Object.keys(ranks).includes(rank.toLowerCase())) ? ranks[rank.toLowerCase()].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Demotion')
        .setDescription(`You have been demoted to **${rank}**`)
        .setThumbnail(user?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .setFooter(footer);
};