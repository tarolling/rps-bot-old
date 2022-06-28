const adjustElo = require('./adjustElo');
const adjustStats = require('./adjustStats');
const changeName = require('./changeName');
const deletePlayer = require('./deletePlayer');
const findPlayer = require('./findPlayer');
const rankValidate = require('./rankValidate');
const registerPlayer = require('./registerPlayer');
const resetPlayer = require('./resetPlayer');
const setPlayerStats = require('./setPlayerStats');
const updateLeaderboards = require('./updateLeaderboards');

module.exports = {
    adjustElo,
    adjustStats,
    changeName,
    deletePlayer,
    findPlayer,
    rankValidate,
    registerPlayer,
    resetPlayer,
    setPlayerStats,
    updateLeaderboards
};