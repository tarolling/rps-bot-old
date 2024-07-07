const { footer } = require('../../config/embeds');
const capitalize = require('../utils/capitalize');


module.exports = (name, info) => {
    const { color, elo: { placement, demo_placement, promotion, demotion } } = info;

    const fields = [
        {
            name: 'Placement',
            value: `${placement || 'N/A'}`,
            inline: true
        },
        {
            name: 'Promotion',
            value: `${promotion || 'N/A'}`,
            inline: true
        },
        {
            name: 'Demotion',
            value: `${demotion || 'N/A'}`,
            inline: true
        },
        {
            name: 'Demotion Placement',
            value: `${demo_placement || 'N/A'}`,
            inline: true
        }
    ]

    return {
        color,
        title: capitalize(name),
        description: '',
        fields,
        footer
    };
}