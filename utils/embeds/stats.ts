const ranks = require('../../config/ranks');
const { footer } = require('../../config/embeds');

module.exports = (data) => {
    const color = (Object.keys(ranks).includes(data.rank.toLowerCase())) ? ranks[data.rank.toLowerCase()].color : null;
    return {
        color,
        title: `${data.username}`,
        description: `${data.rank}`,
        fields: [
            { name: 'Elo', value: `${data.elo}`, inline: true },
            { name: 'Clan', value: `${data.clan}`, inline: true },
            { name: 'Career Games Played', value: `${data.career_games}`, inline: true },
            { name: 'Career Wins', value: `${data.career_wins}`, inline: true },
            { name: 'Career Losses', value: `${data.career_losses}`, inline: true },
            { name: 'Career Win %', value: `${data.career_win_pct}`, inline: true },
            { name: 'Season Games Played', value: `${data.season_games}`, inline: true },
            { name: 'Season Wins', value: `${data.season_wins}`, inline: true },
            { name: 'Season Losses', value: `${data.season_losses}`, inline: true },
            { name: 'Season Win %', value: `${data.season_win_pct}`, inline: true },
            { name: 'Tournament Games Played', value: `${data.tournament_games}`, inline: true },
            { name: 'Tournament Wins', value: `${data.tournament_wins}`, inline: true },
            { name: 'Tournament Losses', value: `${data.tournament_losses}`, inline: true },
            { name: 'Current Streak', value: `${data.current_streak}`, inline: true },
            { name: 'Longest Win Streak', value: `${data.longest_streak}`, inline: true },
            { name: 'Career Peak Elo', value: `${data.career_peak_elo}`, inline: true },
            { name: 'Season Peak Elo', value: `${data.season_peak_elo}`, inline: true }
        ],
        footer
    }
};

export default module.exports;