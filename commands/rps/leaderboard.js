const { SlashCommandBuilder } = require('discord.js');
const { fetchLeaderboards } = require('../../src/db');
const { leaderboard } = require('../../src/embeds');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lb')
        .setDescription('View the global leaderboard.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const players = await fetchLeaderboards();
            if (!players) {
                return interaction.editReply({ content: 'Huh. I guess there are no active players.', ephemeral: true });
            }
            return interaction.editReply({ embeds: [leaderboard(players)] });
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to fetch the leaderboards.', ephemeral: true });
        }
    }
};