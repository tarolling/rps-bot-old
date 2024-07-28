const { SlashCommandBuilder } = require('discord.js');
const { displayQueue } = require('../../src/game/manage-queues');
const { status } = require('../../src/embeds');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Display the status of the queue.'),
    async execute(interaction) {
        const queue = await displayQueue();
        if (!queue) return interaction.reply({ content: 'There are no active queues. Type `/q` to start one!', ephemeral: true }).catch(console.error);

        await interaction.reply({ embeds: [status(queue)] }).catch(console.error);
    }
};