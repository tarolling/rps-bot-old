const { EmbedBuilder } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (player, oldElo, newElo) => {
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle('Elo Change')
        .setDescription(`New Elo: **${newElo}**`)
        .setThumbnail(player?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .addFields({ name: `${oldElo}`, value: 'Previous Elo', inline: true },
            { name: `${newElo - oldElo}`, value: 'Elo Change', inline: true })
        .setFooter(footer);
};