const { EmbedBuilder } = require('discord.js');
const { footer } = require('./embed');
const ranks = require('../../config/ranks.json');

module.exports = (user, data) => {
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