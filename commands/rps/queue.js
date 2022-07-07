const game = require('../../utils/game');
const { queueEmbed } = require('../../utils/embeds');
const { addPlayerToQueue } = require('../../utils/manageQueues');
const ranks = require('../../config/ranks.json');
const { defaultTimeout } = require('../../config/settings.json');
const capitalize = require('../../utils/capitalize');


module.exports = {
    data: {
        name: 'queue',
        description: 'Enter in the queue to play RPS against an opponent.',
        options: [
            {
                type: 4,
                name: 'queue_length',
                description: 'Specify (in minutes) how long you would like to stay in the queue for before automatically leaving.',
                required: false,
                min_value: 1,
                max_value: 60
            }
        ],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const { user, channel, guild } = interaction;

        const queueLength = interaction.options.getInteger('queue_length');
        const queue = await addPlayerToQueue(user, channel.name, (queueLength ? queueLength : defaultTimeout) * 60 * 1000);

        if (!queue) return interaction.reply({ content: 'The bot is currently making the queue.', ephemeral: true });
        if (queue === 'in') return interaction.reply({ content: 'You are already in a queue.', ephemeral: true });
        
        const { players, lobby: { rank, id } } = queue;
        console.log(`Players in queue now: ${players.length}`);

        await interaction.reply({ embeds: [queueEmbed(queue, interaction)] });
        console.log(`${user.username} joined Lobby ${id} in ${capitalize(rank)}`);

        const rankRole = guild.roles.cache.find(r => r.name === `${capitalize(rank)} Ping`);

        if (players.length === 1 && Object.keys(ranks).includes(rank) && rankRole) {
            await interaction.channel.send({ content: `<@&${rankRole.id}>` });
        }
        
        if (players.length === 2) {
            global[`${rank}Queue`] = null;
            await game(queue, interaction);
        }

        return;
    }
};