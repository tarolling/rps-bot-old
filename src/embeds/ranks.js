const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (name, info) => {
    const { color, elo: { placement, demo_placement, promotion, demotion } } = info;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(name.charAt(0).toUpperCase() + name.slice(1))
        .addFields({ name: 'Placement', value: `${placement || 'N/A'}`, inline: true },
            { name: 'Promotion', value: `${promotion || 'N/A'}`, inline: true },
            { name: 'Demotion', value: `${demotion || 'N/A'}`, inline: true },
            { name: 'Demotion Placement', value: `${demo_placement || 'N/A'}`, inline: true })
        .setFooter(footer);
};