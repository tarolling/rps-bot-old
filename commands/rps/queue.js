const playSeries = require('../../utils/game/playSeries');
const ranks = require('../../config/ranks.json');
const capitalize = require('../../utils/misc/capitalize');
const { queueEmbed } = require('../../utils/game/embeds');
const { addPlayerToQueue, findPlayerQueue, findRankQueue, createQueue, deleteRankQueue } = require('../../utils/game/manageQueues');
const { defaultTimeout } = require('../../config/settings.json');
const leave = require('./leave');


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
        const { user, channel, guild } = interaction;
        const rankName = channel.name;

        let rankQueue = await findRankQueue(rankName);
        if (!rankQueue) await createQueue(rankName);

        const playerQueue = await findPlayerQueue(rankName, user);
        if (playerQueue) return interaction.reply({ content: 'You are already in a queue.', ephemeral: true });


        const queueLength = interaction.options.getInteger('queue_length');
        const timeout = setTimeout(async () => {
            await leave.execute(interaction);
        }, (queueLength ? queueLength : defaultTimeout) * 60 * 1000);

        const queue = await addPlayerToQueue(rankName, user, timeout);
        if (!queue) return interaction.reply({ content: 'The lobby is full, please wait until another is created.', ephemeral: true });

        const { players, lobbyInfo: { id, rank, isPlaying } } = queue;

        await interaction.reply({ embeds: [queueEmbed(queue, interaction)] });
        console.log(`${user.username} joined Lobby ${id} in ${capitalize(rank)}`);

        const rankRole = guild.roles.cache.find(r => r.name === `${capitalize(rank)} Ping`);

        if (players.length === 1 && Object.keys(ranks).includes(rank) && rankRole) {
            await channel.send({ content: `<@&${rankRole.id}>` });
        }

        if (players.length === 2) {
            for (const player of players) {
                clearTimeout(player.timeout);
            }
            await deleteRankQueue(rank);
            queue.isPlaying = true;
            if (!isPlaying) await playSeries(queue, interaction);
        }
    }
};