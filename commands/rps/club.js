const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { createClub, joinClub, leaveClub, fetchClub, fetchClubs, fetchPlayerClub } = require('../../src/db/clubs');
const { clubInfo: clubInfoEmbed, clubList } = require('../../src/embeds');


const MAX_PAGES = 5;
const MAX_CLUBS = 50;


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
                )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'join': {
                await interaction.deferReply({ ephemeral: true }).catch(console.error);
                return joinClub(interaction);
            }
            case 'leave': {
                await interaction.deferReply({ ephemeral: true }).catch(console.error);
                return leaveClub(interaction);
            }
            case 'create': {
                const clubCheck = await fetchPlayerClub(interaction.user.id);
                if (clubCheck) {
                    return interaction.reply({ content: `You are already a member of ${clubCheck.name}!` }).catch(console.error);
                }

                const modal = new ModalBuilder()
                    .setCustomId('create-club')
                    .setTitle('Create New Club');

                const clubName = new TextInputBuilder()
                    .setCustomId('club-name')
                    .setLabel('Club Name')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Pittsburgh Steelers')
                    .setMinLength(3)
                    .setMaxLength(32)
                    .setRequired(true)

                const abbreviation = new TextInputBuilder()
                    .setCustomId('club-abbr')
                    .setLabel('Club Abbreviation')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('PIT')
                    .setMinLength(2)
                    .setMaxLength(4)
                    .setRequired(true)

                const actionRowOne = new ActionRowBuilder().addComponents(clubName);
                const actionRowTwo = new ActionRowBuilder().addComponents(abbreviation);

                modal.addComponents(actionRowOne, actionRowTwo);
                await interaction.showModal(modal).catch(console.error);
                const submittedInfo = await interaction.awaitModalSubmit({
                    time: 120_000,
                    filter: i => i.user.id === interaction.user.id
                }).catch(console.error);

                if (submittedInfo) {
                    return createClub(submittedInfo);
                }
                break;
            }
            case 'view': {
                await interaction.deferReply({ ephemeral: true }).catch(console.error);

                const clubName = interaction.options.getString('name') ?? null;
                if (clubName !== null) {
                    const clubDocs = await fetchClub(clubName);
                    if (clubDocs === null || clubDocs === undefined) {
                        return interaction.editReply({ content: 'This club could not be found!', ephemeral: true })
                            .catch(console.error);
                    }

                    const leaderInfo = await interaction.client.users.fetch(clubDocs.leader);
                    const newMembers = [];
                    for (const memberId of clubDocs.members) {
                        const memberInfo = await interaction.client.users.fetch(memberId);
                        newMembers.push({
                            username: memberInfo.username,
                            id: memberId
                        });
                    }

                    const newClubInfo = {
                        leader: {
                            username: leaderInfo.username,
                            id: clubDocs.leader
                        },
                        name: clubDocs.name,
                        abbreviation: clubDocs.abbreviation,
                        members: newMembers
                    };
                    return interaction.editReply({ embeds: [clubInfoEmbed(newClubInfo)], ephemeral: true }).catch(console.error);
                }

                const clubDocs = await fetchClubs(MAX_CLUBS);
                clubDocs.sort((a, b) => b.members.length - a.members.length);

                let clubInfo = [];
                const lazyLoad = async (startIndex, endIndex) => {
                    for (let i = startIndex; i < endIndex; i++) {
                        clubInfo.push({
                            name: clubDocs[i].name,
                            abbreviation: clubDocs[i].abbreviation,
                            members: clubDocs[i].members.length
                        });
                    }
                };

                const numPerPage = 10;
                let currentPageIndex = 0;

                try {
                    await lazyLoad(currentPageIndex * numPerPage, Math.min(clubDocs.length - 1, (currentPageIndex * numPerPage) + numPerPage));
                } catch (e) {
                    console.error(`lazyLoad: ${e}`);
                    return;
                }

                const backButton = new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('Back')
                    .setStyle(ButtonStyle.Secondary);
                const forwardButton = new ButtonBuilder()
                    .setCustomId('forward')
                    .setLabel('Forward')
                    .setStyle(ButtonStyle.Secondary);
                let row = new ActionRowBuilder()
                    .addComponents(forwardButton);

                const message = await interaction.editReply({
                    embeds: [clubList(clubInfo.slice(currentPageIndex * numPerPage, Math.min(clubDocs.length - 1, (currentPageIndex * numPerPage) + numPerPage)))],
                    components: [row]
                }).catch(console.error);

                const buttonFilter = i => i.user.id === interaction.user.id;
                const collector = message.createMessageComponentCollector({ filter: buttonFilter, componentType: ComponentType.Button, idle: 60_000 });

                collector.on('collect', async i => {
                    i.deferUpdate().catch(console.error);
                    if (i.customId === 'back') {
                        currentPageIndex = Math.max(0, currentPageIndex - 1);
                        row.components = (currentPageIndex === 0) ? [forwardButton] : [backButton, forwardButton];
                    } else if (i.customId === 'forward') {
                        currentPageIndex = Math.min(MAX_PAGES - 1, currentPageIndex + 1, (clubDocs.length / numPerPage) - 1);
                        if (clubInfo.length === currentPageIndex * numPerPage) {
                            await lazyLoad(currentPageIndex * numPerPage, Math.min(clubDocs.length - 1, (currentPageIndex * numPerPage) + numPerPage));
                        }
                        row.components = (currentPageIndex === Math.min(MAX_PAGES - 1, (clubDocs.length / numPerPage) - 1)) ? [backButton] : [backButton, forwardButton];
                    }
                    interaction.editReply({
                        embeds: [
                            clubList(clubInfo.slice(currentPageIndex * numPerPage,
                                Math.min(clubDocs.length - 1, (currentPageIndex * numPerPage) + numPerPage)
                            ))
                        ],
                        components: [row]
                    }).catch(console.error);
                    collector.resetTimer({ idle: 60_000 });
                });

                collector.on('end', () => {
                    interaction.editReply({ components: [] }).catch(console.error);
                });

                break;
            }
            default: return;
        }
    }
};