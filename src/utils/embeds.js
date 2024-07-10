const { EmbedBuilder } = require('discord.js');
const ranks = require('../../config/ranks.json');
const capitalize = require('./capitalize');


const footer = {
    "text": "Powered by RPS",
    "iconURL": "https://i.imgur.com/YODnmBn.png"
};

const challenge = (interaction) => {
    return new EmbedBuilder()
        .setTitle('New Challenger Approaching')
        .setDescription(`**${interaction.user.username}** has challenged you to a game of RPS!`)
        .setFooter(footer);
};

const club = (club) => {
    const { name, abbreviation } = club;
    return new EmbedBuilder()
        .setTitle(name)
        .setDescription(abbreviation)
        .setFooter(footer);
};

const demotion = (member, rank, dm) => {
    const color = (Object.keys(ranks).includes(rank.toLowerCase())) ? ranks[rank.toLowerCase()].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Demotion')
        .setDescription(`${(dm) ? 'You have' : `**${member.displayName}** has`} been demoted to **${rank}**`)
        .setThumbnail(member.user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .setFooter(footer);
};

const eloResult = (queue, player, oldElo, newElo) => {
    const { lobbyInfo: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Elo Change')
        .setDescription(`New Elo: **${newElo}**`)
        .setThumbnail(player?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .addFields({ name: `${oldElo}`, value: 'Previous Elo', inline: true },
            { name: `${newElo - oldElo}`, value: 'Elo Change', inline: true })
        .setFooter(footer);
};

const leaderboard = (data) => {
    const color = (Object.keys(ranks).includes(data[0].rank.toLowerCase())) ? ranks[data[0].rank.toLowerCase()].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(data[0].rank)
        .addFields(data.map(({ username, elo }) => ({ name: username, value: `${elo}`, inline: true })))
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

const gameDraw = (queue) => {
    const { players, lobbyInfo: { gameNumber, rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('GAME DRAW')
        .setDescription(`Game ${gameNumber}`)
        .addFields({ name: `${players[0].choice || 'N/A'}`, value: players[0].user.username, inline: true },
            { name: `${players[1].choice || 'N/A'}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};

const gameLoss = (queue) => {
    const { players, lobbyInfo: { gameNumber, rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('GAME LOSS')
        .setDescription(`Game ${gameNumber}`)
        .addFields({ name: `${players[0].choice || 'N/A'}`, value: players[0].user.username, inline: true },
            { name: `${players[1].choice || 'N/A'}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};

const gameWin = (queue) => {
    const { players, lobbyInfo: { gameNumber, rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('GAME WIN')
        .setDescription(`Game ${gameNumber}`)
        .addFields({ name: `${players[0].choice || 'N/A'}`, value: players[0].user.username, inline: true },
            { name: `${players[1].choice || 'N/A'}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};

const promotion = (member, rank, dm) => {
    const color = (Object.keys(ranks).includes(rank.toLowerCase())) ? ranks[rank.toLowerCase()].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Promotion')
        .setDescription(`${(dm) ? 'You have' : `**${member.displayName}** has`} been promoted to **${rank}**`)
        .setThumbnail(member.user?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .setFooter(footer);
};

const queueEmbed = (queue, user) => {
    const { players } = queue;
    return new EmbedBuilder()
        .setTitle(`${players.length} player${players.length === 1 ? ' is' : 's are'} in the queue`)
        .setDescription(`**${user.username}** has joined.`)
        .setThumbnail(user?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .setFooter(footer);
};

const ranksEmbed = (name, info) => {
    const { color, elo: { placement, demo_placement, promotion, demotion } } = info;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(capitalize(name))
        .addFields({ name: 'Placement', value: `${placement || 'N/A'}`, inline: true },
            { name: 'Promotion', value: `${promotion || 'N/A'}`, inline: true },
            { name: 'Demotion', value: `${demotion || 'N/A'}`, inline: true },
            { name: 'Demotion Placement', value: `${demo_placement || 'N/A'}`, inline: true })
        .setFooter(footer);
};

const results = (id, queue) => {
    const { players, lobbyInfo: { gameNumber } } = queue;
    const color = (Object.keys(ranks).includes(null)) ? ranks[null].color : null;
    const winner = players[0].score > players[1].score ? players[0].user : (players[1].score > players[0].score ? players[1].user : null);
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(`Lobby #${id} Results`)
        .setDescription(`**Games Played:** ${gameNumber}`)
        .setThumbnail(winner?.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
        .addFields({ name: `${players[0].score}`, value: players[0].user.username, inline: true },
            { name: `${players[1].score}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};

const stats = (user, data) => {
    const { rank, elo, club, career_games, career_wins,
        career_losses, career_win_pct, season_games,
        season_wins, season_losses, season_win_pct,
        tournament_games, tournament_wins, tournament_losses,
        current_streak, longest_streak, career_peak_elo,
        season_peak_elo } = data;
    const color = (Object.keys(ranks).includes(rank.toLowerCase())) ? ranks[rank.toLowerCase()].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(user.username)
        .setDescription(rank)
        .addFields({ name: 'Elo', value: `${elo}`, inline: true },
            { name: 'Club', value: `${club || 'None'}`, inline: true },
            { name: 'Career Games Played', value: `${career_games}`, inline: true },
            { name: 'Career Wins', value: `${career_wins}`, inline: true },
            { name: 'Career Losses', value: `${career_losses}`, inline: true },
            { name: 'Career Win %', value: `${career_win_pct}`, inline: true },
            { name: 'Season Games Played', value: `${season_games}`, inline: true },
            { name: 'Season Wins', value: `${season_wins}`, inline: true },
            { name: 'Season Losses', value: `${season_losses}`, inline: true },
            { name: 'Season Win %', value: `${season_win_pct}`, inline: true },
            { name: 'Tournament Games Played', value: `${tournament_games}`, inline: true },
            { name: 'Tournament Wins', value: `${tournament_wins}`, inline: true },
            { name: 'Tournament Losses', value: `${tournament_losses}`, inline: true },
            { name: 'Current Streak', value: `${current_streak}`, inline: true },
            { name: 'Longest Win Streak', value: `${longest_streak}`, inline: true },
            { name: 'Career Peak Elo', value: `${career_peak_elo}`, inline: true },
            { name: 'Season Peak Elo', value: `${season_peak_elo}`, inline: true })
        .setFooter(footer);
};

const status = (queue) => {
    const { players, lobbyInfo: { rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('RPS Status')
        .setDescription(`Player in queue: <@!${players[0].user.id}>`)
        .setFooter(footer);
};

const waiting = (queue, interaction) => {
    const { players, lobbyInfo: { gameNumber, rank } } = queue;
    const color = (Object.keys(ranks).includes(rank)) ? ranks[rank].color : null;
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Waiting for opponent...')
        .setDescription(`Game ${gameNumber}`)
        .addFields({ name: `${(players[0].user.id === interaction.user.id) ? players[0].choice : '???'}`, value: players[0].user.username, inline: true },
            { name: `${(players[1].user.id === interaction.user.id) ? players[1].choice : '???'}`, value: players[1].user.username, inline: true })
        .setFooter(footer);
};

module.exports = {
    challenge,
    club,
    demotion,
    eloResult,
    game,
    gameDraw,
    gameLoss,
    gameWin,
    leaderboard,
    leaveEmbed,
    promotion,
    queueEmbed,
    ranksEmbed,
    results,
    stats,
    status,
    waiting
};