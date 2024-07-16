const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { addPlayerToChallenge, createChallenge, findPlayerQueue } = require('../../src/game/manageQueues');
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

        if (!target) return interaction.reply({ content: 'Unable to find user.', ephemeral: true }).catch(console.error);
        if (target.id === interaction.user.id) return interaction.reply({ content: 'You cannot challenge yourself.', ephemeral: true }).catch(console.error);
        if (target.bot) return interaction.reply({ content: 'You cannot challenge a bot.', ephemeral: true }).catch(console.error);

        const playerQueue = await findPlayerQueue(user);
        if (playerQueue !== null) return interaction.reply({ content: 'You are already in a lobby.', ephemeral: true }).catch(console.error);

        let queue = await createChallenge();
        queue = await addPlayerToChallenge(queue, user);

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
            challengeMessage = await target.send({ embeds: [challenge(interaction)], components: [row] });
        } catch {
            return interaction.reply({
                content: 'Unable to DM user. Either they have DMs from server members turned off, or they blocked me :(',
                ephemeral: true
            }).catch(console.error);
        }

        interaction.reply({ content: 'Challenge sent!', ephemeral: true }).catch(console.error);

        const filter = i => i.user.id === target.id;

        const collector = challengeMessage.createMessageComponentCollector({ filter, time: 30_000 });

        collector.on('collect', async (i) => {
            i.deferUpdate();
            collector.stop();
            if (i.customId === 'Accept') {
                await challengeMessage.edit({ components: [] }).catch(console.error);
                queue = await addPlayerToChallenge(queue, target);
                playSeries('challenge', queue, interaction);
            } else {
                challengeMessage.edit({ content: 'Challenge declined.', embeds: [], components: [], ephemeral: true }).catch(console.error);
                interaction.followUp({ content: 'Challenge declined.', ephemeral: true }).catch(console.error);
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason !== 'time') return;

            challengeMessage.edit({ content: 'Challenge timed out.', embeds: [], components: [], ephemeral: true }).catch(console.error);
            interaction.followUp({ content: 'Challenge timed out.', ephemeral: true }).catch(console.error);
        });
    }
};