const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (queue) => {
    const { game: { number, p1, p2 }, lobby: { rank, id } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: `Lobby #${id} - Game ${number}`,
        description: 'Make your selection. You have 30 seconds!',
        fields: [
            { name: p1.user.username, value: `${p1.score}`, inline: true },
            { name: p2.user.username, value: `${p2.score}`, inline: true }
        ],
        footer
    };
};