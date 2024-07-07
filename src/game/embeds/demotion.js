const ranks = require('../../../config/ranks.json');
const { footer } = require('../../../config/embeds.json');


module.exports = (member, rank, dm) => {
    const color = (Object.keys(ranks).includes(rank.toLowerCase())) ? ranks[rank.toLowerCase()].color : null;
    return {
        color,
        title: 'Demotion',
        description: `${(dm) ? 'You have' : `**${member.displayName}** has`} been demoted to **${rank}**`,
        thumbnail: {
            url: member.user.displayAvatarURL({ format: 'png', dynamic: true })
        },
        footer
    };
};