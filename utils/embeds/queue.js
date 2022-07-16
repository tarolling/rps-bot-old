const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (queue) => {
    const { players, lobbyInfo: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: `${players.length} player${players.length === 1 ? ' is' : 's are'} in the queue`,
        description: `**${players[players.length - 1].user.username}** has joined.`,
        footer
    };
};