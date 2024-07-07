const ranks = require('../../../config/ranks.json');
const { footer } = require('../../../config/embeds.json');


module.exports = (queue) => {
    const { players } = queue;
    const color = (Object.keys(ranks).includes(null)) ? ranks[null].color : null;
    return {
        color,
        title: `0 players are in the queue`,
        description: `**${players[0].user.username}** has left.`,
        footer
    };
};