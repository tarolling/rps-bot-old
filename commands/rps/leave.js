const { findPlayerQueue, removePlayerFromQueue } = require('../../src/game/manageQueues');
const { leave } = require('../../src/game/embeds');


module.exports = {
    data: {
        name: 'l',
        description: 'Leave the queue.',
        options: [],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const { user, channel } = interaction;
        const queueId = await findPlayerQueue(user);
        const queue = await removePlayerFromQueue(queueId, user);

        if (interaction.deferred || interaction.replied) {
            if (!queue) return channel.send({ content: 'You are not in a queue.', ephemeral: true });

            if (interaction.inGuild()) {
                await channel.send({ embeds: [leave(queue)] });
                console.log(`${user.username} left Lobby ${queueId}`);
                return;
            }

            await user.send({ embeds: [leave(queue)] });
            console.log(`${user.username} left Lobby ${queueId}`);
        } else {
            if (!queue) return interaction.reply({ content: 'You are not in a queue.', ephemeral: true });

            await interaction.reply({ embeds: [leave(queue)] });
            console.log(`${user.username} left Lobby ${queueId}`);
        }
    }
};