const { footer } = require('../../config/embeds');

module.exports = () => {
    return {
        color: null,
        title: 'Server Rules',
        description: '',
        fields: [
            {
                name: 'Respect',
                value: `Treat everyone with respect.
                Absolutely no harassment, witch hunting, sexism, racism, or hate speech will be tolerated.`
            },
            {
                name: 'Spam/Self-Promotion',
                value: `No spam or self-promotion (server invites, advertisements, etc.) without permission from a staff member.
                This includes DMing fellow members.`
            },
            {
                name: 'NSFW Content',
                value: `No NSFW or obscene content.
                This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.`
            },
            {
                name: 'Cheating',
                value: 'No cheating/collaborating with other players in order to gain Elo. RNGs are allowed.'
            },
            {
                name: 'Alternate Accounts',
                value: 'Alternate accounts are not permitted.'
            },
            {
                name: 'Discord Compliance',
                value: 'All members must follow the Discord Terms of Service.'
            }
        ],
        footer
    };
};