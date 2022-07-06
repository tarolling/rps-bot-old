const { removePlayerFromQueue } = require('../../utils/manageQueues');
const { leave } = require('../../utils/embeds');


module.exports = {
    data: {
        name: 'leave',
        description: 'Leave the queue.',
        options: [],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const { user, channel } = interaction;
        const queue = await removePlayerFromQueue(user, channel.name);
        if (!queue) return interaction.reply({ content: 'You are not in a queue.', ephemeral: true });

        await interaction.reply({ embeds: [leave(queue, interaction)] });
    }
};