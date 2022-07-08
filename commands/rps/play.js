const game = require('../../utils/game');
const { challenge } = require('../../utils/embeds');
const { addPlayerToChallenge, createQueue } = require('../../utils/manageQueues');


module.exports = {
    data: {
        name: 'play',
        description: 'Play RPS against a specific user.',
        options: [
            {
                type: 6,
                name: 'user',
                description: 'Specify the user you would like to play against.',
                required: true
            }
        ],
        default_member_permissions: (1 << 11) // SEND_MESSAGES
    },
    async execute(interaction) {
        const { user } = interaction;

        const target = interaction.options.getUser('user');
        
        if (!target) return interaction.reply({ content: 'Unable to find user.', ephemeral: true });
        if (target.id === interaction.user.id) return interaction.reply({ content: 'You cannot challenge yourself.', ephemeral: true });
        if (target.bot) return interaction.reply({ content: 'You cannot challenge a bot.', ephemeral: true });
        
        let queue = createQueue(`challenge-${user.id}`);
        await addPlayerToChallenge(queue, user);
        let acceptBtn = {
            type: 'BUTTON',
            label: 'Accept',
            custom_id: 'Accept',
            style: 'SUCCESS',
            emoji: null,
            url: null,
            disabled: false
        };
        let declineBtn = {
            type: 'BUTTON',
            label: 'Decline',
            custom_id: 'Decline',
            style: 'DANGER',
            emoji: null,
            url: null,
            disabled: false
        }
        let row = {
            type: 'ACTION_ROW',
            components: [acceptBtn, declineBtn]
        };

        let challengeMessage;

        try {
            await target.send({ embeds: [challenge(interaction)], components: [row] })
                .then(msg => challengeMessage = msg);
            await interaction.reply({ content: 'Challenge sent!', ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: 'Unable to DM user.', ephemeral: true });
        }

        const filter = i => i.user.id === target.id;

        const collector = challengeMessage.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async (i) => {
            i.deferUpdate();
            acceptBtn.disabled = true;
            declineBtn.disabled = true;
            row.components = [acceptBtn, declineBtn];
            if (i.customId === 'Accept') {
                await challengeMessage.edit({ components: [row] });
                queue = await addPlayerToChallenge(queue, target);
                await game(queue, interaction);
            } else {
                await challengeMessage.edit({ content: 'Challenge declined.', embeds: [], components: [row], ephemeral: true });
                await interaction.followUp({ content: 'Challenge declined.', ephemeral: true });
            }

            collector.stop();
        });

        collector.on('end', async (collected, reason) => {
            if (reason !== 'time') return;

            acceptBtn.disabled = true;  
            declineBtn.disabled = true;
            row.components = [acceptBtn, declineBtn];
            await challengeMessage.edit({ content: 'Challenge timed out.', embeds: [], components: [row], ephemeral: true });
            await interaction.followUp({ content: 'Challenge timed out.', ephemeral: true });
        });
    }
};