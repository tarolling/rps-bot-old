const registerPlayer = require('../../src/db/registerPlayer');


module.exports = {
    data: {
        name: 'register',
        description: 'Register a user to the RPS database.',
        options: [],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
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