const findPlayer = require('../../src/db/findPlayer');
const { stats: statsEmbed } = require('../../src/utils/embeds');



module.exports = {
    data: {
        name: 'stats',
        description: 'View your stats.',
        options: [
            {
                type: 6,
                name: 'user',
                description: 'Specify the user you would like to view.',
                required: false
            }
        ],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            const user = interaction.options.getUser('user') || interaction.user;
            const stats = await findPlayer(user.id);
            if (!stats) return interaction.editReply({ content: 'The user you specified is not in the database.', ephemeral: true });

            return interaction.editReply({ embeds: [statsEmbed(user, stats)], ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to retrieve the player.', ephemeral: true });
        }
    }
};