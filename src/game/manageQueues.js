const { Mutex, Semaphore, withTimeout } = require('async-mutex');


let globalQueues = {};
let globalLobbyId = 1;

const playerInfo = (user, timeout) => {
    return {
        user,
        timeout: timeout || undefined,
        choice: '',
        score: 0
    }
};

const createQueue = async () => {
    globalQueues[`${rank}`] = {
        players: [],
        lobbyInfo: {
            isPlaying: false,
            gameNumber: 0,
            id: globalLobbyId++,
            rank: rank
        }
    };

    return globalQueues[`${rank}`];
};

/*
* Case 1: There will ALWAYS be a queue available for every rank.
* Case 2: A queue does exist for the rank -> Cases 3 & 4.
* Case 3: Player is already in a queue -> Return queue.
* Case 4: Player is not in a queue -> Add player to queue.
*/
const addPlayerToQueue = async (player, timeout) => {
    const { players } = globalQueues[`${rank}`];
    if (players.length >= 2) return undefined;

    players.push(playerInfo(player, timeout));

    return globalQueues[`${rank}`];
};

const addPlayerToChallenge = async (lobbyId, player) => {
    const { players } = globalQueues[`${rank}`];
    players.push(playerInfo(player));
    return globalQueues[`${rank}`];
}

const removePlayerFromQueue = async (lobbyId, player) => {
    if (!globalQueues[`${rank}`]) return undefined;

    const playerIndex = globalQueues[`${rank}`].players.findIndex(p => p.user.id === player.id);

    if (playerIndex === -1) return undefined;

    const { players } = globalQueues[`${rank}`];
    clearTimeout(players[playerIndex].timeout);

    const queue = globalQueues[`${rank}`];
    globalQueues[`${rank}`] = null;

    globalLobbyId--;
    return queue;
};

const findPlayerQueue = async (player) => {
    if (!globalQueues) return true;
    return globalQueues.players.find(p => p.user.id === player.id);
};

const displayQueue = async (lobbyId) => {
    const queue = globalQueues[lobbyId];
    return (!queue || queue?.players.length === 0) ? undefined : queue;
};

const deleteRankQueue = async (lobbyId) => {
    globalQueues[lobbyId] = null;
}

module.exports = {
    createQueue,
    addPlayerToQueue,
    addPlayerToChallenge,
    removePlayerFromQueue,
    findPlayerQueue,
    displayQueue,
    deleteRankQueue
};