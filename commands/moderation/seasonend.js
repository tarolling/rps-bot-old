const { seasonReset } = require('../../src/db');


module.exports = {
    data: {
        name: 'seasonend',
        description: 'Reset all players back to starting elo.',
        options: [],
        default_member_permissions: (1 << 3) // ADMINISTRATOR
    },
    async execute(interaction) {
        if (interaction.user.id !== '417455238522339330') return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });

        try {
            await interaction.deferReply({ ephemeral: true });
            await seasonReset(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to reset players.', ephemeral: true });
        }
    }
};