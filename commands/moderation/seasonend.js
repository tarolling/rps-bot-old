const seasonReset = require('../../src/db/seasonReset');


module.exports = {
    data: {
        name: 'seasonend',
        description: 'Reset all players back to starting elo.',
        options: [],
        default_member_permissions: (1 << 3) // ADMINISTRATOR
    },
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await seasonReset(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to reset players.', ephemeral: true });
        }
    }
};