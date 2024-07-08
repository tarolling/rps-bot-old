const { Events, PresenceUpdateStatus } = require('discord.js');


module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const promises = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];

        Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                client.user.setPresence({ activities: [{ name: `${totalMembers} players across ${totalGuilds} servers` }], status: PresenceUpdateStatus.Online });
            })
            .catch(console.error);
        console.log(`Ready! Logged in as ${client.user.displayName}`);
    }
};