const { ShardingManager } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');

const token = (process.argv.findIndex(s => s === 'dev') === -1) ? process.env.PROD_TOKEN : process.env.DEV_TOKEN;

let args = []
if (process.argv.findIndex(s => s === 'dev') !== -1) args.push('dev')

const manager = new ShardingManager('./bot.js', { execArgv: ['-r', 'dotenv/config'], shardArgs: args, token: token });

/* Top.gg stats */
if (process.argv.findIndex(s => s === 'dev') === -1) {
    const ap = AutoPoster(process.env.TOPGG_API_TOKEN, manager);
    ap.on('posted', (stats) => {
        console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
    });
    ap.on('error', (error) => {
        console.warn(`Unable to post stats to Top.gg | ${error}`);
    });
}

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();