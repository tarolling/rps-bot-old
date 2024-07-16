const { SlashCommandBuilder } = require('discord.js');
const { findPlayer } = require('../../src/db');
const { stats: statsEmbed } = require('../../src/embeds');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View your stats.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Specify the user you would like to view.')
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true }).catch(console.error);
            const user = interaction.options.getUser('user') || interaction.user;
            const stats = await findPlayer(user.id);
            if (!stats) return interaction.editReply({ content: 'The user you specified is not in the database.', ephemeral: true }).catch(console.error);

            return interaction.editReply({ embeds: [statsEmbed(user, stats)], ephemeral: true }).catch(console.error);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to retrieve the player.', ephemeral: true }).catch(console.error);
        }
    }
};