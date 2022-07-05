const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { MODE_ARG } = require('./config/settings.json');


// eslint-disable-next-line
const token = (!process.argv[MODE_ARG]) ? process.env.PROD_TOKEN : process.env.DEV_TOKEN;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
    allowedMentions: {
        parse: [
            'users',
            'roles'
        ]
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    presence: {
        status: 'dnd',
        activities: [
            {
                name: 'the next best RPS player',
                type: 'WATCHING'
            }
        ]
    }
});

client.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

async function login() {
    try {
        await client.login(token);
    } catch (err) {
        console.error('The client encountered an error while logging in:', err);
    }
}

login()