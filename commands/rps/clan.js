const createClan = require('../../utils/db/createClan');
const joinClan = require('../../utils/db/joinClan');

module.exports = {
    data: {
        name: 'clan',
        description: 'Join or create a clan.',
        options: [
            {
                type: 1,
                name: 'join',
                description: 'Join an existing clan.',
                options: [
                    {
                        type: 3,
                        name: 'clan_name',
                        description: 'Specify which clan you would like to join (case insensitive).',
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: 'create',
                description: 'Create a new clan for people to join.',
                options: [
                    {
                        type: 3,
                        name: 'clan_name',
                        description: 'Specify what you what like the clan to be called.',
                        required: true
                    }
                ]
            }
        ],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const guild = interaction.guild;

        try {
            await interaction.deferReply({ ephemeral: true });
            let update = null;
            if (interaction.options.getSubcommand() === 'join') {
                update = await joinClan(interaction);
            }
            else if (interaction.options.getSubcommand() === 'create') {
                update = await createClan(interaction);
            }

            if (!guild.available) return;
            if (update && interaction.user.id !== '417455238522339330') {
                const originalName = await interaction.member.nickname;
                await interaction.member.setNickname(update + ` ${originalName}`);
            }

        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to join/create a clan.', ephemeral: true });
        }
    }
};