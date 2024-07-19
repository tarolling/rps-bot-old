const { Events, escapeUnderline } = require('discord.js');


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            const start = Date.now();
            await command.execute(interaction);
            console.log(`COMMAND: ${interaction.commandName} by ${escapeUnderline(interaction.user.username)} ` +
                `(${interaction.user.id} - Guild: ${interaction.guildId}) Locale: ${interaction.locale}, ` +
                `msecs: ${Date.now() - start}`);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
                    .catch(console.error);
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
                    .catch(console.error);
            }
        }
    }
};