const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { fetchPlayerLeaderboard } = require('../../src/db');
const { leaderboard } = require('../../src/embeds');

const MAX_PAGES = 5;
const MAX_PLAYERS = 50;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lb')
        .setDescription('View the global leaderboards.')
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Type of leaderboard')
                .setRequired(true)
                .setChoices(
                    { name: 'Players', value: 'lb_players' },
                    { name: 'Clubs', value: 'lb_clubs' }
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const lbType = interaction.options.get_string('type');

        let players;
        try {
            players = await fetchPlayerLeaderboard(MAX_PLAYERS);
            if (!players) {
                return interaction.editReply({ content: 'Huh. I guess there are no active players.', ephemeral: true });
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to fetch the leaderboards.', ephemeral: true });
        }

        let playerInfo = [];

        const lazyLoad = async (startIndex, endIndex) => {
            for (let i = startIndex; i < endIndex; i++) {
                playerInfo.push({
                    player: await interaction.client.users.fetch(players[i].user_id),
                    elo: players[i].elo
                });
            }
        };

        const numPerPage = 10;
        let currentPageIndex = 0;

        await lazyLoad(currentPageIndex * numPerPage, (currentPageIndex * numPerPage) + numPerPage);

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
            embeds: [leaderboard(playerInfo.slice(currentPageIndex * numPerPage, (currentPageIndex * numPerPage) + numPerPage))],
            components: [row]
        });

        const buttonFilter = i => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter: buttonFilter, componentType: ComponentType.Button, idle: 60_000 });

        collector.on('collect', async i => {
            i.deferUpdate();
            if (i.customId === 'back') {
                currentPageIndex = Math.max(0, currentPageIndex - 1);
                row.components = (currentPageIndex === 0) ? [forwardButton] : [backButton, forwardButton];
            } else if (i.customId === 'forward') {
                currentPageIndex = Math.min(MAX_PAGES - 1, currentPageIndex + 1);
                if (playerInfo.length === currentPageIndex * numPerPage) await lazyLoad(currentPageIndex * numPerPage, (currentPageIndex * numPerPage) + numPerPage);
                row.components = (currentPageIndex === MAX_PAGES - 1) ? [backButton] : [backButton, forwardButton];
            }
            await interaction.editReply({
                embeds: [leaderboard(playerInfo.slice(currentPageIndex * numPerPage, (currentPageIndex * numPerPage) + numPerPage))],
                components: [row]
            });
            collector.resetTimer({ idle: 60_000 });
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] });
        });
    }
};