const ranks = require('../../../config/ranks.json');
const { footer } = require('../../../config/embeds.json');


module.exports = (queue, interaction) => {
    const { players, lobbyInfo: { gameNumber, rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: 'Waiting for opponent...',
        description: `Game ${gameNumber}`,
        fields: [
            { name: `${(players[0].user.id === interaction.user.id) ? players[0].choice : '???'}`, value: players[0].user.username, inline: true },
            { name: `${(players[1].user.id === interaction.user.id) ? players[1].choice : '???'}`, value: players[1].user.username, inline: true }
        ],
        footer
    };
};