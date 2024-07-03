const { footer } = require('../../../config/embeds.json');


module.exports = (club) => {
    const { name, abbreviation } = club;

    return {
        color: null,
        title: `${name}`,
        description: `${abbreviation}`,
        footer
    };
};