const findPlayer = require('../../utils/db/findPlayer');
const statsEmbed = require('../../utils/embeds/stats');


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
            const member = interaction.guild.members.cache.find(m => m.id === user.id);
            const stats = await findPlayer(member.id);
            if (!stats) return interaction.editReply({ content: 'The user you specified is not in the database.', ephemeral: true });

            return interaction.editReply({ embeds: [statsEmbed(stats)], ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to retrieve the player.', ephemeral: true });
        }
    }
};