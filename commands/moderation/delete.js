const deletePlayer = require('../../utils/db/deletePlayer');
const ranks = require('../../config/ranks.json');

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
        default_member_permissions: (1 << 3) // 0x0000000000000008 - admin
    },
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await deletePlayer(interaction);

            const member = interaction.guild.members.cache.find(m => m.id === interaction.options.getUser('user').id);
            const guild = interaction.guild;
            if (guild.available) {
                for (const key of Object.keys(ranks)) {
                    // this but make the key capitalized
                    const rank = key.charAt(0).toUpperCase() + key.slice(1);
                    const role = guild.roles.cache.find(r => r.name === rank);
                    if (role) await member.roles.remove(role);
                }
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to delete the player.', ephemeral: true });
        }
    }
};