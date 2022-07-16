const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (queue) => {
    const { players, lobbyInfo: { gameNumber, rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: 'GAME WIN',
        description: `Game ${gameNumber}`,
        fields: [
            { name: `${players[0].choice || 'N/A'}`, value: players[0].user.username, inline: true },
            { name: `${players[1].choice || 'N/A'}`, value: players[1].user.username, inline: true }
        ],
        footer
    };
};