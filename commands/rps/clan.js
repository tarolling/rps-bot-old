const { createClan, joinClan, leaveClan, viewClan } = require('../../utils/db/clan');

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
                        description: 'Specify which clan you would like to join.',
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: 'leave',
                description: 'Leave your existing clan.',
                options: []
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
                    },
                    {
                        type: 3,
                        name: 'abbreviation',
                        description: `Specify your clan's desired abbreviation - must be 4 characters or less.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: 'view',
                description: 'View a specific clan or a list of clans.',
                options: [
                    {
                        type: 3,
                        name: 'clan_name',
                        description: 'Specify what clan you would like to view, or leave blank to view all clans.',
                        required: false
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
            let updatedNickname = null;
            let subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'join': {
                    updatedNickname = await joinClan(interaction);
                    break;
                }
                case 'leave': {
                    updatedNickname = await leaveClan(interaction);
                    break;
                }
                case 'create': {
                    const clanAbbr = interaction.options.getString('abbreviation');
                    if (clanAbbr.length > 4) return interaction.editReply({ content: 'Clan abbreviations must under 5 characters.' });
                    
                    updatedNickname = await createClan(interaction);
                    break;
                }
                case 'view': {
                    updatedNickname = await viewClan(interaction);
                    break;
                }
                default: break;
            }

            if (!guild.available) return;
            if (updatedNickname?.length <= 32 && interaction.user.id !== '417455238522339330') {
                await interaction.member.setNickname(updatedNickname);
            }

        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to join/create a clan.', ephemeral: true });
        }
    }
};