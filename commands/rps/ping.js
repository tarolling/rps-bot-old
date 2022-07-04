const findPlayer = require('../../utils/db/findPlayer');


module.exports = {
    data: {
        name: 'ping',
        description: 'Manage your ping settings.',
        options: [
            {
                type: 3,
                name: 'toggle',
                description: 'Turn pinging on or off.',
                required: true,
                choices: [
                    {
                        name: 'On',
                        value: 'on'
                    },
                    {
                        name: 'Off',
                        value: 'off'
                    }
                ]
            }
        ],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const { guild, member, user, options } = interaction;

        try {
            await interaction.deferReply({ ephemeral: true });
            const stats = await findPlayer(member.id || user.id);
            if (!stats) return interaction.editReply({ content: 'The user you specified is not in the database.', ephemeral: true });

            const option = options.getString('toggle');
            const role = guild.roles.cache.find(r => r.name === `${stats.rank} Ping`);
            if (!role) return interaction.editReply({ content: 'That role does not exist.', ephemeral: true });

            if (option === 'on') await member.roles.add(role);
            if (option === 'off') await member.roles.remove(role);
        } catch (e) {
            console.error(e);
            return interaction.editReply({ content: 'An error occurred while trying to edit ping settings.', ephemeral: true });
        }

        return interaction.editReply({ content: 'Operation successful.', ephemeral: true });
    }
};