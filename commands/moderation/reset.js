const resetPlayer = require('../../utils/db/resetPlayer');
const ranks = require('../../config/ranks.json');
const capitalize = require('../../utils/capitalize');
const { defaultRank } = require('../../config/settings.json');


module.exports = {
    data: {
        name: 'reset',
        description: 'Reset a player\'s stats.',
        options: [
            {
                type: 6,
                name: 'user',
                description: 'Specify the user you would like to reset.',
                required: true
            }
        ],
        default_member_permissions: (1 << 3) // ADMINISTRATOR
    },
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await resetPlayer(interaction);

            const guild = interaction.guild;
            
            if (guild.available) {
                const member = guild.members.cache.find(m => m.id === interaction.options.getUser('user').id);
                for (const key of Object.keys(ranks)) {
                    // this but make the key capitalized
                    const rank = capitalize(key);
                    const role = guild.roles.cache.find(r => r.name === rank);
                    if (role) await member.roles.remove(role);
                }
                await member.roles.add(guild.roles.cache.find(r => r.name === defaultRank));
            }
            
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to reset the player.', ephemeral: true });
        }
    }
};