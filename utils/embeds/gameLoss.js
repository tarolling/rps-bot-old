const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');

module.exports = (queue) => {
    const { game: { number, p1, p2 }, lobby: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: 'GAME LOSS',
        description: `Game ${number}`,
        fields: [
            { name: p1.user.username, value: `${p1.choice || 'N/A'}`, inline: true },
            { name: p2.user.username, value: `${p2.choice || 'N/A'}`, inline: true }
        ],
        footer
    };
};