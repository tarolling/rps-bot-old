const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const generatePermissions = require('./utils/generatePermissions');
const { MODE_ARG } = require('./config/settings.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = () => {
    const token = (process.argv[MODE_ARG] === 'main' || !process.argv[MODE_ARG]) ? process.env.MAIN_TOKEN : process.env.DEV_TOKEN;
    const clientId = (process.argv[MODE_ARG] === 'main' || !process.argv[MODE_ARG]) ? process.env.MAIN_CLIENT_ID : process.env.DEV_CLIENT_ID;
    const guildId = (process.argv[MODE_ARG] === 'main' || !process.argv[MODE_ARG]) ? process.env.MAIN_GUILD_ID : process.env.DEV_GUILD_ID;

    const commands = [];
    const commandFolders = fs.readdirSync('./commands');

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            commands.push(command.data);
        }
    }

    const rest = new REST({ version: '10' }).setToken(token);
    
    // 
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
};