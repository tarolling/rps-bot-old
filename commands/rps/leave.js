const { removePlayerFromQueue } = require('../../utils/game/manageQueues');
const { leave } = require('../../utils/game/embeds');
const capitalize = require('../../utils/misc/capitalize');


module.exports = {
    data: {
        name: 'l',
        description: 'Leave the queue.',
        options: [],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const { user, channel } = interaction;
        const queue = await removePlayerFromQueue(channel.name, user);

        if (interaction.deferred || interaction.replied) {
            if (!queue) return channel.send({ content: 'You are not in a queue.', ephemeral: true });
    
            const { lobbyInfo: { id, rank } } = queue;
    
            await channel.send({ embeds: [leave(queue)] });
            console.log(`${user.username} left Lobby ${id} in ${capitalize(rank)}`);
        } else {
            if (!queue) return interaction.reply({ content: 'You are not in a queue.', ephemeral: true });

            const { lobbyInfo: { id, rank } } = queue;
            
            await interaction.reply({ embeds: [leave(queue)] });
            console.log(`${user.username} left Lobby ${id} in ${capitalize(rank)}`);
        }
    }
};