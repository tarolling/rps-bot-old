const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (queue) => {
    const { game: { number, p1, p2 }, lobby: { rank, id } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;

    let winner = p1.score === 3 ? p1.user : (p2.score === 3 ? p2.user : null);
    return {
        color,
        title: `Lobby #${id} Results`,
        description: `**Games Played:** ${number}`,
        thumbnail: {
            url: winner?.displayAvatarURL({ format: 'png', dynamic: true })
        },
        fields: [
            { name: p1.user.username, value: `${p1.score}`, inline: true },
            { name: p2.user.username, value: `${p2.score}`, inline: true }
        ],
        footer
    };
};