const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');

module.exports = (queue) => {
    const { playerIdsIndexed, lobby: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: 'RPS Status',
        description: `Player in queue: <@!${Object.keys(playerIdsIndexed)[0]}>`,
        footer
    };
}