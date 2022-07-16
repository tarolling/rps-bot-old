const { footer } = require('../../config/embeds');


module.exports = (clan) => {
    const { name, abbreviation } = clan;

    return {
        color: null,
        title: `${name}`,
        description: `${abbreviation}`,
        footer
    };
};