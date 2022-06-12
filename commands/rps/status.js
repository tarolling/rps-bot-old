const { displayRankQueue } = require('../../utils/manageQueues');
const { status } = require('../../utils/embeds');

module.exports = {
    data: {
        name: 'status',
        description: 'Display the status of the queue.',
        options: [],
        default_permission: true
    },
    async execute(interaction) {
        const { channel } = interaction;
        const queue = await displayRankQueue(channel.name);
        if (!queue) return interaction.reply({ content: 'There are no active queues. Type /queue to start one!', ephemeral: true });

        interaction.reply({ embeds: [status(queue)] }).catch(console.error);
    }
};