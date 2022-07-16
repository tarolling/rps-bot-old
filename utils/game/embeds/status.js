const ranks = require('../../../config/ranks.json');
const { footer } = require('../../../config/embeds.json');


module.exports = (queue) => {
    const { players, lobbyInfo: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: 'RPS Status',
        description: `Player in queue: <@!${players[0].user.id}>`,
        footer
    };
};