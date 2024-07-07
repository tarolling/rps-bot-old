const ranks = require('../../../config/ranks.json');
const { footer } = require('../../../config/embeds.json');


module.exports = (id, queue) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    const color = (Object.keys(ranks).includes(null)) ? ranks[null].color : null;

    const winner = players[0].score > players[1].score ? players[0].user : (players[1].score > players[0].score ? players[1].user : null);

    return {
        color,
        title: `Lobby #${id} Results`,
        description: `**Games Played:** ${gameNumber}`,
        thumbnail: {
            url: winner?.displayAvatarURL({ format: 'png', dynamic: true })
        },
        fields: [
            { name: `${players[0].score}`, value: players[0].user.username, inline: true },
            { name: `${players[1].score}`, value: players[1].user.username, inline: true }
        ],
        footer
    };
};