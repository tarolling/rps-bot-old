const { Events, PresenceUpdateStatus, ActivityType } = require('discord.js');
const { fetchNumDocuments } = require('../src/db');



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
        updatePresence(client);
        setInterval(updatePresence, 300_000, client);
        console.log(`Ready! Logged in as ${client.user.displayName}`);
    }
};