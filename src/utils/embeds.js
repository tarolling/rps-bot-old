const { EmbedBuilder } = require('discord.js');



const footer = {
    "text": "Powered by RPS",
    "iconURL": "https://i.imgur.com/YODnmBn.png"
};


const queueEmbed = (queue, user) => {
    const { players } = queue;
    return new EmbedBuilder()
        .setTitle(`${players.length} player${players.length === 1 ? ' is' : 's are'} in the queue`)
        .setDescription(`**${user.username}** has joined.`)
        .setThumbnail(user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .setFooter(footer);
};

const leaveEmbed = (queue, user) => {
    return new EmbedBuilder()
        .setTitle('0 players are in the queue')
        .setDescription(`**${user.username}** has left.`)
        .setThumbnail(user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .setFooter(footer);
};

const game = (id, queue) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    return new EmbedBuilder()
        .setTitle(`Lobby #${id} - Game ${gameNumber}`)
        .setDescription('Make your selection. You have 30 seconds! First to 4 wins.')
        .addFields({ name: `${players[0].score}`, value: players[0].user.username, inline: true },
            { name: `${players[1].score}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};

module.exports = {
    queueEmbed,
    leaveEmbed,
    game
};