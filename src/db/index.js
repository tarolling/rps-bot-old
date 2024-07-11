const adjustElo = require('./adjustElo');
const adjustStats = require('./adjustStats');
const deletePlayer = require('./deletePlayer');
const fetchLeaderboards = require('./fetchLeaderboards');
const findPlayer = require('./findPlayer');
const rankValidate = require('./rankValidate');
const registerPlayer = require('./registerPlayer');
const resetPlayer = require('./resetPlayer');
const setPlayerStats = require('./setPlayerStats');


module.exports = {
    adjustElo,
    adjustStats,
    deletePlayer,
    fetchLeaderboards,
    findPlayer,
    rankValidate,
    registerPlayer,
    resetPlayer,
    setPlayerStats
};