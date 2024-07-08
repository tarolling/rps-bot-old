const { ShardingManager } = require('discord.js');

const token = (process.argv.findIndex(s => s === 'dev') == -1) ? process.env.PROD_TOKEN : process.env.DEV_TOKEN;

let args = []
if (process.argv.findIndex(s => s === 'dev') != -1) args.push('dev')

const manager = new ShardingManager('./bot.js', { execArgv: ['-r', 'dotenv/config'], shardArgs: args, token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();