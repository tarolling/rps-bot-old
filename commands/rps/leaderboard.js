const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { fetchLeaderboards } = require('../../src/db');
const { leaderboard } = require('../../src/embeds');

const MAX_PAGES = 5;
const MAX_PLAYERS = 50;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lb')
        .setDescription('View the global leaderboard.'),
    async execute(interaction) {
        await interaction.deferReply()
            .catch(console.error);

        const { client } = interaction;

        let players;
        try {
            players = await fetchLeaderboards(MAX_PLAYERS);
            if (!players) {
                return interaction.editReply({
                    content: 'Huh. I guess there are no active players.',
                    ephemeral: true
                }).catch(console.error);
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({
                content: 'An error occurred while trying to fetch the leaderboards.',
                ephemeral: true
            }).catch(console.error);
        }

        let playerInfo = [];

        const lazyLoad = async (startIndex, endIndex) => {
            for (let i = startIndex; i < endIndex; i++) {
                playerInfo.push({
                    player: await client.users.fetch(players[i].user_id),
                    elo: players[i].elo
                });
            }
        };

        const numPerPage = MAX_PLAYERS / MAX_PAGES;
        let currentPageIndex = 0;

        try {
            await lazyLoad(currentPageIndex * numPerPage, (currentPageIndex * numPerPage) + numPerPage);
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
            embeds: [leaderboard(playerInfo.slice(currentPageIndex * numPerPage, (currentPageIndex * numPerPage) + numPerPage))],
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
                currentPageIndex = Math.min(MAX_PAGES - 1, currentPageIndex + 1);
                if (playerInfo.length === currentPageIndex * numPerPage) await lazyLoad(currentPageIndex * numPerPage, (currentPageIndex * numPerPage) + numPerPage);
                row.components = (currentPageIndex === MAX_PAGES - 1) ? [backButton] : [backButton, forwardButton];
            }
            interaction.editReply({
                embeds: [leaderboard(playerInfo.slice(currentPageIndex * numPerPage, (currentPageIndex * numPerPage) + numPerPage))],
                components: [row]
            }).catch(console.error);
            collector.resetTimer({ idle: 60_000 });
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] }).catch(console.error);
        });
    }
};