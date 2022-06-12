const registerPlayer = require('../../utils/db/registerPlayer');

module.exports = {
    data: {
        name: 'register',
        description: 'Register a user to the RPS database.',
        options: [
            {
                type: 3,
                name: 'username',
                description: 'Specify the username you would like to register with.',
                required: true
            }
        ],
        default_permission: true
    },
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await registerPlayer(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to register your account.', ephemeral: true });
        }
    }
};