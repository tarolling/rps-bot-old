const { Events, PresenceUpdateStatus, ActivityType } = require('discord.js');


const updatePresence = (client) => {
    const promises = [
        client.shard.fetchClientValues('guilds.cache.size'),
        client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];

    Promise.all(promises)
        .then(results => {
            const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
            client.user.setPresence({ activities: [{ name: `${totalMembers} players across ${totalGuilds} servers`, type: ActivityType.Watching }], status: PresenceUpdateStatus.Online });
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