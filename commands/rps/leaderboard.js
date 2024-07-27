const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { fetchPlayerLeaderboard } = require('../../src/db');
const { playerLeaderboard } = require('../../src/embeds');

const MAX_PLAYERS = 25;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lb')
        .setDescription('View the global leaderboards.'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
            .catch(console.error);

        let players;
        try {
            players = await fetchPlayerLeaderboard(MAX_PLAYERS);
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

        const numPerPage = 10;
        const maxPageIndex = Math.ceil(MAX_PLAYERS / numPerPage) - 1;
        let playerInfo = [];
        let currentPageIndex = 0;

        await (async () => {
            for (let i = 0; i < players.length; i++) {
                const player = await interaction.client.users.fetch(players[i].user_id);
                playerInfo.push({
                    player: player,
                    elo: players[i].elo
                });
            }
        })();

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
            embeds: [playerLeaderboard(playerInfo.slice(currentPageIndex * numPerPage, Math.min(MAX_PLAYERS, (currentPageIndex * numPerPage) + numPerPage)))],
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
                currentPageIndex = Math.min(currentPageIndex + 1, maxPageIndex);
                row.components = (currentPageIndex === maxPageIndex) ? [backButton] : [backButton, forwardButton];
            }
            interaction.editReply({
                embeds: [
                    playerLeaderboard(playerInfo.slice(
                        currentPageIndex * numPerPage,
                        Math.min(MAX_PLAYERS, (currentPageIndex * numPerPage) + numPerPage)
                    ))
                ],
                components: [row]
            }).catch(console.error);
            collector.resetTimer({ idle: 60_000 });
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] }).catch(console.error);
        });
    }
};