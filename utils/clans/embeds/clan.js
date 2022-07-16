const { footer } = require('../../../config/embeds.json');


module.exports = (clan) => {
    const { name, abbreviation } = clan;

    return {
        color: null,
        title: `${name}`,
        description: `${abbreviation}`,
        footer
    };
};