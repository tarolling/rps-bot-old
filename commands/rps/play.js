const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { addPlayerToChallenge, createChallenge, deleteChallenge, findPlayerQueue } = require('../../src/game/manageQueues');
const { challenge } = require('../../src/embeds');
const playSeries = require('../../src/game/playSeries');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Challenge a user to a game of RPS.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Specify the user you would like to play against.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { user } = interaction;

        const target = interaction.options.getUser('user');

        if (!target) return interaction.reply({ content: 'Unable to find user.', ephemeral: true });
        if (target.id === interaction.user.id) return interaction.reply({ content: 'You cannot challenge yourself.', ephemeral: true });
        if (target.bot) return interaction.reply({ content: 'You cannot challenge a bot.', ephemeral: true });

        const playerQueue = await findPlayerQueue(user);
        if (playerQueue !== null) return interaction.reply({ content: 'You are already in a lobby.', ephemeral: true });

        const lobbyId = `challenge-${user.id}`;
        await createChallenge(lobbyId);
        await addPlayerToChallenge(lobbyId, user);

        const acceptBtn = new ButtonBuilder()
            .setCustomId('Accept')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success);
        const declineBtn = new ButtonBuilder()
            .setCustomId('Decline')
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger);

        let challengeMessage;
        const row = new ActionRowBuilder()
            .addComponents(acceptBtn, declineBtn);

        try {
            await target.send({ embeds: [challenge(interaction)], components: [row] })
                .then(msg => challengeMessage = msg);
            await interaction.reply({ content: 'Challenge sent!', ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: 'Unable to DM user.', ephemeral: true });
        }

        const filter = i => i.user.id === target.id;

        const collector = challengeMessage.createMessageComponentCollector({ filter, time: 30_000 });

        collector.on('collect', async (i) => {
            i.deferUpdate();
            collector.stop();
            acceptBtn.setDisabled(true);
            declineBtn.setDisabled(true);
            if (i.customId === 'Accept') {
                await challengeMessage.edit({ components: [row] });
                const queue = await addPlayerToChallenge(lobbyId, target);
                playSeries(lobbyId, queue, interaction);
            } else {
                await challengeMessage.edit({ content: 'Challenge declined.', embeds: [], components: [row], ephemeral: true });
                await interaction.followUp({ content: 'Challenge declined.', ephemeral: true });
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason !== 'time') return;

            acceptBtn.setDisabled(true);
            declineBtn.setDisabled(true);
            await challengeMessage.edit({ content: 'Challenge timed out.', embeds: [], components: [row], ephemeral: true });
            await interaction.followUp({ content: 'Challenge timed out.', ephemeral: true });
            await deleteChallenge(lobbyId);
        });
    }
};