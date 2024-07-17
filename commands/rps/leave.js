const { SlashCommandBuilder } = require('discord.js');
const { findPlayerQueue, removePlayerFromQueue } = require('../../src/game/manageQueues');
const { leave: leaveEmbed } = require('../../src/embeds');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('l')
        .setDescription('Leave the queue.'),
    async execute(interaction) {
        const { user } = interaction;
        const queueId = await findPlayerQueue(user);
        const queue = await removePlayerFromQueue(queueId, user);

        if (interaction.deferred || interaction.replied) {
            if (!queue) return interaction.editReply({ content: 'You are not in a queue.', ephemeral: true }).catch(console.error);

            if (interaction.inGuild()) {
                interaction.followUp({ embeds: [leaveEmbed(user)] }).catch(console.error);
                console.log(`${user.username} left Lobby ${queueId}`);
                return;
            }

            try {
                await user.send({ embeds: [leaveEmbed(user)] });
            } catch (error) {
                console.warn(`Unable to DM ${user.username} (${user.id}) - ${error}`);
            }
            console.log(`${user.username} left Lobby ${queueId}`);
        } else {
            if (!queue) return interaction.reply({ content: 'You are not in a queue.', ephemeral: true }).catch(console.error);

            interaction.reply({ embeds: [leaveEmbed(user)] }).catch(console.error);
            console.log(`${user.username} left Lobby ${queueId}`);
        }
    }
};