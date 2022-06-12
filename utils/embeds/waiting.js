const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');

module.exports = (queue, interaction) => {
    const { game: { number, p1, p2 }, lobby: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return {
        color,
        title: 'Waiting for opponent...',
        description: `Game ${number}`,
        fields: [
            { name: p1.user.username, value: `${(p1.user.id === interaction.user.id) ? p1.choice : '???'}`, inline: true },
            { name: p2.user.username, value: `${(p2.user.id === interaction.user.id) ? p2.choice : '???'}`, inline: true }
        ],
        footer
    };
};

export default module.exports;