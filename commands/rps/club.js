const { createClub, joinClub, leaveClub, viewClub } = require('../../src/clubs/db');
const clubEmbed = require('../../src/clubs/embeds/club');


module.exports = {
    data: {
        name: 'club',
        description: 'Join or create a club.',
        options: [
            {
                type: 1,
                name: 'join',
                description: 'Join an existing club.',
                options: [
                    {
                        type: 3,
                        name: 'club_name',
                        description: 'Specify which club you would like to join.',
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: 'leave',
                description: 'Leave your existing club.',
                options: []
            },
            {
                type: 1,
                name: 'create',
                description: 'Create a new club for people to join.',
                options: [
                    {
                        type: 3,
                        name: 'club_name',
                        description: 'Specify what you what like the club to be called.',
                        required: true
                    },
                    {
                        type: 3,
                        name: 'abbreviation',
                        description: `Specify your club's desired abbreviation - must be 4 characters or less.`,
                        required: true
                    }
                ]
            },
            {
                type: 1,
                name: 'view',
                description: 'View a specific club or a list of clubs.',
                options: [
                    {
                        type: 3,
                        name: 'club_name',
                        description: 'Specify what club you would like to view, or leave blank to view all clubs.',
                        required: false
                    }
                ]
            }
        ],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const { guild } = interaction;
        if (!guild.available) return;

        try {
            await interaction.deferReply({ ephemeral: true });
            let updatedNickname = null;
            let subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'join': {
                    updatedNickname = await joinClub(interaction);
                    if (updatedNickname?.length <= 32 && interaction.user.id !== '417455238522339330') {
                        await interaction.member.setNickname(updatedNickname);
                    }
                    break;
                }
                case 'leave': {
                    updatedNickname = await leaveClub(interaction);
                    if (updatedNickname?.length <= 32 && interaction.user.id !== '417455238522339330') {
                        await interaction.member.setNickname(updatedNickname);
                    }
                    break;
                }
                case 'create': {
                    const clubAbbr = interaction.options.getString('abbreviation');
                    if (clubAbbr.length > 4) return interaction.editReply({ content: 'Club abbreviations must under 5 characters.' });

                    updatedNickname = await createClub(interaction);
                    if (updatedNickname?.length <= 32 && interaction.user.id !== '417455238522339330') {
                        await interaction.member.setNickname(updatedNickname);
                    }
                    break;
                }
                case 'view': {
                    const club = await viewClub(interaction);
                    if (!club) return interaction.editReply({ content: 'This club could not be found!', ephemeral: true });
                    await interaction.editReply({ embeds: [clubEmbed(club)], ephemeral: true });
                    break;
                }
                default: break;
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to join/create a club.', ephemeral: true });
        }
    }
};