const changeName = require('../../utils/db/changeName');

module.exports = {
    data: {
        name: 'change_username',
        description: 'PREMIUM | Change your username.',
        options: [
            {
                type: 6,
                name: 'username',
                description: 'Specify the username you would like to change to.',
                required: true
            }
        ],
        default_permission: false
    },
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await changeName(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to change your username.', ephemeral: true });
        }
    }
};