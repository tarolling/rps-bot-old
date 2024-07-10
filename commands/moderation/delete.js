const deletePlayer = require('../../src/db/deletePlayer');


module.exports = {
    data: {
        name: 'delete',
        description: 'Delete a player from the database.',
        options: [
            {
                type: 6,
                name: 'user',
                description: 'Specify the user you would like to remove from the database.',
                required: true
            }
        ],
        default_member_permissions: (1 << 3) // ADMINISTRATOR
    },
    async execute(interaction) {
        if (interaction.user.id !== '417455238522339330') return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });

        try {
            await interaction.deferReply({ ephemeral: true });
            await deletePlayer(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to delete the player.', ephemeral: true });
        }
    }
};