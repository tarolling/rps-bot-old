const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (member, rank, dm) => {
    const color = (Object.keys(ranks).includes(rank.toLowerCase())) ? ranks[rank.toLowerCase()].color : null;
    return {
        color,
        title: 'Promotion',
        description: `${(dm) ? 'You have' : `**${member.displayName}** has`} been promoted to **${rank}**`,
        thumbnail: {
            url: member.user.displayAvatarURL({ format: 'png', dynamic: true })
        },
        footer
    };
};