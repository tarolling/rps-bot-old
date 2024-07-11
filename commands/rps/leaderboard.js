const { SlashCommandBuilder } = require('discord.js');
const updateLeaderboards = require('../../src/db/updateLeaderboards');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lb')
        .setDescription('View the global leaderboards.'),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await updateLeaderboards(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to refresh the leaderboards.', ephemeral: true });
        }
    }
};