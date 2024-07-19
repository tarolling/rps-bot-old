const { SlashCommandBuilder } = require('discord.js');
const { createClub, joinClub, leaveClub, viewClub } = require('../../src/db/clubs');
const { club: clubEmbed } = require('../../src/embeds');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('club')
        .setDescription('Join, create, leave, or view a club.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new club.')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('Type in the name of your club.')
                        .setMinLength(3)
                        .setMaxLength(32)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('abbreviation')
                        .setDescription(`Type in your club's abbreviation.`)
                        .setMinLength(2)
                        .setMaxLength(4)
                        .setRequired(true)
                )

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Join an existing club.')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('Specify which club you would like to join.')
                        .setMinLength(3)
                        .setMaxLength(32)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Leave your existing club.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View a specific club or a list of clubs.')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('Specify what club you would like to view.')
                        .setMinLength(3)
                        .setMaxLength(32)
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true })
                .catch(console.error);

            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'join': {
                    await joinClub(interaction);
                    break;
                }
                case 'leave': {
                    await leaveClub(interaction);
                    break;
                }
                case 'create': {
                    await createClub(interaction);
                    break;
                }
                case 'view': {
                    const club = await viewClub(interaction);
                    if (!club) {
                        return interaction.editReply({ content: 'This club could not be found!', ephemeral: true })
                            .catch(console.error);
                    }
                    await interaction.editReply({ embeds: [clubEmbed(club)], ephemeral: true })
                        .catch(console.error);
                    break;
                }
                default: break;
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({
                content: 'An error occurred while trying to join/create a club.',
                ephemeral: true
            }).catch(console.error);
        }
    }
};