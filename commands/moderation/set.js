const setPlayerStats = require('../../utils/db/setPlayerStats');

module.exports = {
    data: {
        name: 'set',
        description: 'Set a player\'s stats.',
        options: [
            {
                type: 6,
                name: 'user',
                description: 'The user to set.',
                required: true
            },
            {
                type: 4,
                name: 'elo',
                description: 'The player\'s new elo.',
                required: true,
                min_value: 100,
                max_value: 3500
            }
        ],
        default_member_permissions: (1 << 3) // ADMINISTRATOR
    },
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await setPlayerStats(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to set the player.', ephemeral: true });
        }
    }
}