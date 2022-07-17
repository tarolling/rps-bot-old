const ranks = require('../../../config/ranks.json');
const { footer } = require('../../../config/embeds.json');


module.exports = (queue, player, oldElo, newElo) => {
    const { lobbyInfo: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;

    return {
        color,
        title: `Elo Change`,
        description: `New Elo: **${newElo}**`,
        thumbnail: {
            url: player?.displayAvatarURL({ format: 'png', dynamic: true })
        },
        fields: [
            { name: `${oldElo}`, value: 'Previous Elo', inline: true },
            { name: `${newElo - oldElo}`, value: 'Elo Change', inline: true }
        ],
        footer
    };
};