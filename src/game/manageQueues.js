const { Mutex } = require('async-mutex');


let globalQueues = {};
let globalLobbyId = 1;
const mutex = new Mutex();

const playerInfo = (user, timeout) => {
    return {
        user,
        timeout: timeout || undefined,
        choice: '',
        score: 0
    }
};

const createQueue = async () => {
    const release = await mutex.acquire();
    try {
        globalQueues[globalLobbyId++] = {
            players: [],
            lobbyInfo: {
                isPlaying: false,
                gameNumber: 0,
            }
        };

        return globalLobbyId - 1;
    } finally {
        release();
    }
};

const createChallenge = async (lobbyId) => {
    const release = await mutex.acquire();
    try {
        globalQueues[lobbyId] = {
            players: [],
            lobbyInfo: {
                isPlaying: false,
                gameNumber: 0,
            }
        };
    } finally {
        release();
    }
}

const deleteChallenge = async (lobbyId) => {
    const release = await mutex.acquire();
    try {
        delete globalQueues[lobbyId];
    } finally {
        release();
    }
}

/*
* Case 1: There will ALWAYS be a queue available for every rank.
* Case 2: A queue does exist for the rank -> Cases 3 & 4.
* Case 3: Player is already in a queue -> Return queue.
* Case 4: Player is not in a queue -> Add player to queue.
*/
const addPlayerToQueue = async (lobbyId, player, timeout) => {
    const release = await mutex.acquire();
    try {
        const { players } = globalQueues[lobbyId];
        if (players.length >= 2) return undefined;
        players.push(playerInfo(player, timeout));
        return globalQueues[lobbyId];
    } finally {
        release();
    }
};

const addPlayerToChallenge = async (lobbyId, player) => {
    const release = await mutex.acquire();
    try {
        let { players } = globalQueues[lobbyId];
        players.push(playerInfo(player));
        return globalQueues[lobbyId];
    } finally {
        release();
    }
}

const removePlayerFromQueue = async (lobbyId, player) => {
    const release = await mutex.acquire();
    try {
        if (!globalQueues[lobbyId]) return undefined;

        const playerIndex = globalQueues[lobbyId].players.findIndex(p => p.user.id === player.id);
        if (playerIndex === -1) return undefined;

        const { players } = globalQueues[lobbyId];
        clearTimeout(players[playerIndex].timeout);

        const queue = globalQueues[lobbyId];
        globalQueues[lobbyId] = null;

        globalLobbyId--;
        return queue;
    } finally {
        release();
    }
};

const findPlayerQueue = async (player) => {
    const release = await mutex.acquire();
    try {
        if (Object.keys(globalQueues).length == 0) return undefined;
        for (const [id, queue] of Object.entries(globalQueues)) {
            const candidate = queue?.players.find(p => p.user.id === player.id);
            if (candidate) return id;
        }
        return undefined;
    } finally {
        release();
    }
};

const findOpenQueue = async () => {
    const release = await mutex.acquire();
    try {
        if (Object.keys(globalQueues).length == 0) return undefined;
        for (const [id, queue] of Object.entries(globalQueues)) {
            if (queue?.players.length == 1) return id;
        }
        return undefined;
    } finally {
        release();
    }
};

const displayQueue = async () => {
    const release = await mutex.acquire();
    try {
        if (Object.keys(globalQueues).length == 0) return undefined;
        for (const [id, queue] of Object.entries(globalQueues)) {
            if (!queue?.lobbyInfo.isPlaying) return queue;
        }
        return undefined;
    } finally {
        release();
    }
};

const deleteRankQueue = async (lobbyId) => {
    const release = await mutex.acquire();
    try {
        delete globalQueues[lobbyId];
    } finally {
        release();
    }
}

module.exports = {
    createQueue,
    createChallenge,
    deleteChallenge,
    addPlayerToQueue,
    addPlayerToChallenge,
    removePlayerFromQueue,
    findPlayerQueue,
    findOpenQueue,
    displayQueue,
    deleteRankQueue
};