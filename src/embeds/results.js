const { EmbedBuilder } = require('discord.js');
const { footer } = require('./footer');

module.exports = (id, queue) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    const winner = players[0].score > players[1].score ? players[0].user : (players[1].score > players[0].score ? players[1].user : null);
    return new EmbedBuilder()
        .setTitle(`Lobby #${id} Results`)
        .setDescription(`**Games Played:** ${gameNumber}`)
        .setThumbnail(winner?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .addFields({ name: `${players[0].score}`, value: players[0].user.username, inline: true },
            { name: `${players[1].score}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};