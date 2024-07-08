const playSeries = require('../../src/game/playSeries');
const { queueEmbed } = require('../../src/utils/embeds');
const { addPlayerToQueue, findPlayerQueue, createQueue, deleteRankQueue, findOpenQueue } = require('../../src/game/manageQueues');
const { defaultTimeout } = require('../../config/settings.json');
const leave = require('./leave');
const { findPlayer } = require('../../src/db');


module.exports = {
    data: {
        name: 'q',
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
        const { user } = interaction;
        const player_doc = await findPlayer(user.id);
        if (!player_doc) {
            return interaction.reply({ content: 'You are not registered.', ephemeral: true });
        }

        let playerQueueId = await findPlayerQueue(user);
        if (playerQueueId) return interaction.reply({ content: 'You are already in a queue.', ephemeral: true });

        playerQueueId = await findOpenQueue();
        if (!playerQueueId) {
            playerQueueId = await createQueue();
        }

        const queueLength = interaction.options.getInteger('queue_length');
        const timeout = setTimeout(async () => {
            await leave.execute(interaction);
        }, (queueLength ? queueLength : defaultTimeout) * 60 * 1000);

        const queue = await addPlayerToQueue(playerQueueId, user, timeout);
        if (!queue) return interaction.reply({ content: 'The lobby is full, please wait until another is created.', ephemeral: true });

        const { players, lobbyInfo: { isPlaying } } = queue;

        await interaction.reply({ embeds: [queueEmbed(queue, user)] });
        console.log(`${user.username} joined Lobby ${playerQueueId}`);

        if (players.length === 2) {
            for (const player of players) {
                clearTimeout(player.timeout);
            }
            await deleteRankQueue(playerQueueId);
            queue.isPlaying = true;
            if (!isPlaying) await playSeries(playerQueueId, queue, interaction);
        }
    }
};