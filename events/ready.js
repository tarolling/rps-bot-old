const { Events, PresenceUpdateStatus, ActivityType } = require('discord.js');
const { fetchNumDocuments } = require('../src/db');
const { createDjsClient } = require('discordbotlist');
const bfd = require('bfd-api-redux');



const updateBotSiteStats = (client) => {
    /* Discord Bot Lists */
    const dbl = createDjsClient(process.env.DBL_API_TOKEN, client);
    dbl.startPosting();

    const commands = client.commands.map(c => c.data.toJSON());
    dbl.postBotCommands(commands);

    /* Discords.com */
    const api = new bfd(process.env.BFD_API_TOKEN, process.env.PROD_CLIENT_ID);
    api.setServers(client.guilds.cache.size);
};

const updatePresence = (client) => {
    fetchNumDocuments('players')
        .then(playerCount => {
            client.user.setPresence({
                activities: [{ name: `${playerCount} players compete for glory`, type: ActivityType.Watching }],
                status: PresenceUpdateStatus.Online
            });
        })
        .catch(console.error);
};

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        if (process.argv.findIndex(s => s === 'dev') === -1) updateBotSiteStats(client);

        updatePresence(client);
        setInterval(updatePresence, 300_000, client);
        console.log(`Ready! Logged in as ${client.user.displayName}`);
    }
};