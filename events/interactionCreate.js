const ranks = require('../config/ranks');


module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand() || !interaction.channel) return; 
        if (!(Object.keys(ranks).includes(interaction.channel.name)) && interaction.commandName !== 'register') {
            await interaction.reply({ content: 'You cannot execute commands in this channel.', ephemeral: true });
            return;
        }

        const client = interaction.client;
        const command = client.commands.get(interaction.commandName);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};