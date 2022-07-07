const { removePlayerFromQueue } = require('../../utils/manageQueues');
const { leave } = require('../../utils/embeds');
const capitalize = require('../../utils/capitalize');


module.exports = {
    data: {
        name: 'l',
        description: 'Leave the queue.',
        options: [],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const { user, channel } = interaction;
        const queue = await removePlayerFromQueue(user, channel.name);
        if (!queue) return interaction.reply({ content: 'You are not in a queue.', ephemeral: true });

        const { lobby: { rank, id } } = queue;

        await interaction.reply({ embeds: [leave(queue, interaction)] });
        console.log(`${user.username} left Lobby ${id} in ${capitalize(rank)}`);
    }
};