const { defaultElo, defaultRank } = require('../../config/settings.json');


const addValues = (interaction) => {
    return {
        user_id: interaction.user.id,
        club: "None",
        elo: defaultElo,
        sigma: 0,
        rank: defaultRank,
        career_games: 0,
        career_wins: 0,
        career_losses: 0,
        career_win_pct: 0,
        season_games: 0,
        season_wins: 0,
        season_losses: 0,
        season_win_pct: 0,
        tournament_games: 0,
        tournament_wins: 0,
        tournament_losses: 0,
        current_streak: 0,
        longest_streak: 0,
        career_peak_elo: defaultElo,
        season_peak_elo: defaultElo
    };
};

module.exports = {
    addValues
};