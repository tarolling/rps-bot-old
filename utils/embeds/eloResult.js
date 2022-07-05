const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (queue, player, newElo, eloDiff) => {
    const { lobby: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;

    return {
        color,
        title: `Elo Change`,
        description: `**New Elo:** ${newElo}`,
        thumbnail: {
            url: player?.displayAvatarURL({ format: 'png', dynamic: true })
        },
        fields: [
            { name: 'Previous Elo', value: `${newElo - eloDiff}`, inline: true },
            { name: 'Elo Change', value: `${eloDiff}`, inline: true }
        ],
        footer
    };
};