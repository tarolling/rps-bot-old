const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { MODE_ARG } = require('./config/settings.json');

module.exports = () => {
    const token = (!process.argv[MODE_ARG]) ? process.env.PROD_TOKEN : process.env.DEV_TOKEN;
    const clientId = (!process.argv[MODE_ARG]) ? process.env.PROD_CLIENT_ID : process.env.DEV_CLIENT_ID;
    const guildId = (!process.argv[MODE_ARG]) ? process.env.PROD_GUILD_ID : process.env.DEV_GUILD_ID;

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
    
    // Application command permissions have moved to UI as of 04/27/22
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
};