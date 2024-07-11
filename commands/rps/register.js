const { SlashCommandBuilder } = require('discord.js');
const registerPlayer = require('../../src/db/registerPlayer');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('r')
        .setDescription('Register to start playing Ranked RPS.'),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await registerPlayer(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to register your account.', ephemeral: true });
        }
    }
};