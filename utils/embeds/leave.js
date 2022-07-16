const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (queue) => {
    const { players, lobbyInfo: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: `0 players are in the queue`,
        description: `**${players[0].user.username}** has left.`,
        footer
    };
};