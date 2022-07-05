const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (queue, interaction) => {
    const { playerIdsIndexed, lobby: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: `${Object.keys(playerIdsIndexed).length} player${Object.keys(playerIdsIndexed).length === 1 ? ' is' : 's are'} in the queue`,
        description: `**${interaction.member.displayName}** has joined.`,
        footer
    };
};