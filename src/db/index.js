const adjustRating = require('./adjust-rating');
const adjustStats = require('./adjust-stats');
const fetchNumDocuments = require('./fetch-num-documents');
const fetchPlayerLeaderboard = require('./fetch-player-leaderboard');
const findPlayer = require('./find-player');
const rankValidate = require('./rank-validate');
const registerPlayer = require('./register-player');


module.exports = {
    adjustRating,
    adjustStats,
    fetchNumDocuments,
    fetchPlayerLeaderboard,
    findPlayer,
    rankValidate,
    registerPlayer
};