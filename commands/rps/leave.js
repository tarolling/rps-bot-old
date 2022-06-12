const { removePlayerFromQueue, deleteQueue } = require('../../utils/manageQueues');
const { leave } = require('../../utils/embeds');

module.exports = {
    data: {
        name: 'leave',
        description: 'Leave the queue.',
        options: [],
        default_member_permissions: 0x0
    },
    async execute(interaction) {
        const { user, channel } = interaction;
        const queue = await removePlayerFromQueue(user, channel.name);
        if (!queue) return interaction.reply({ content: 'You are not in a queue.', ephemeral: true });

        const { playerIdsIndexed, lobby: { id } } = queue;

        await interaction.reply({ embeds: [leave(queue, interaction)] });

        if (Object.keys(playerIdsIndexed).length === 0) deleteQueue(id, false);
    }
};