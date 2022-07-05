const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');


module.exports = (data) => {
    const color = (Object.keys(ranks).includes(data[0].rank.toLowerCase())) ? ranks[data[0].rank.toLowerCase()].color : null;
    return {
        color,
        title: data[0].rank,
        fields: data.map(({ username, elo }) => ({ name: username, value: `${elo}` })),
        footer
    };
};