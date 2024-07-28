const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { MongoClient, ServerApiVersion } = require('mongodb');


const token = (process.argv.findIndex(s => s === 'dev') === -1) ? process.env.PROD_TOKEN : process.env.DEV_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds
    ],
    allowedMentions: {
        parse: [
            'users'
        ]
    }
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`The command at ${filePath} is missing a required "data" or "execute" property`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

/* DiscordAPI error handling */
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(token);

const dbClient = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await dbClient.connect();
        await dbClient.db("rps").command({ ping: 1 });
        console.log("Pinged deployment. Successfully connected to MongoDB!");
    } finally {
        await dbClient.close();
    }
}

run().catch(console.dir);