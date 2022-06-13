const createQueue = (rank) => {
    return {
        players: [],
        playerIdsIndexed: {},
        timeouts: {},
        game: {
            number: 0,
            p1: {
                user: {},
                choice: '',
                score: 0
            },
            p2: {
                user: {},
                choice: '',
                score: 0
            }
        },
        lobby: {
            id: global.lobbyId++,
            rank: rank
        }
    };
};

/*
* Case 1: A queue does not exist for the given rank. -> Create a new queue.
* Case 2: A queue does exist for the rank -> Cases 3 & 4.
* Case 3: Player is already in the queue -> Return queue.
* Case 4: Player is not in a queue -> Add player to queue.
*/
const addPlayerToQueue = (player, rank, timeout) => {
    const rankQueue = global[`${rank}Queue`];

    if (!rankQueue.length) {
        const newQueue = createQueue(rank);
        newQueue.players.push(player);
        newQueue.playerIdsIndexed[player.id] = player;
        if (timeout) {
            newQueue.timeouts[player.id] = setTimeout(() => {
                removePlayerFromQueue(player, rank);
            }, timeout);
        }
        rankQueue.push(newQueue);
        return newQueue;
    }

    const playersQueue = rankQueue.find(queue => queue.playerIdsIndexed[player.id]);

    if (playersQueue) return undefined;

    const notFullQueue = rankQueue.find(queue => (Object.keys(queue.playerIdsIndexed).length < 2)
        && rank === queue.lobby.rank);

    if (notFullQueue) {
        const { players, timeouts, playerIdsIndexed } = notFullQueue;
        players.push(player);
        if (timeout) {
            timeouts[player.id] = setTimeout(() => {
                removePlayerFromQueue(player, rank);
            }, timeout);
        }
        playerIdsIndexed[player.id] = player;
        return notFullQueue;
    }

    const newQueue = createQueue(rank);
    newQueue.players.push(player);
    newQueue.playerIdsIndexed[player.id] = player;
    if (timeout) {
        newQueue.timeouts[player.id] = setTimeout(() => {
            removePlayerFromQueue(player, rank);
        }, timeout);
    }
    rankQueue.push(newQueue);
    return newQueue;
};

const removePlayerFromQueue = (player, rank) => {
    const rankQueue = global[`${rank}Queue`];

    const queue = rankQueue.find(queue => queue.lobby.rank === rank);

    if (!queue) return undefined;

    const { players, playerIdsIndexed, timeouts } = queue;

    if (players.length > 0 && playerIdsIndexed[player.id]) {
        const index = players.findIndex(p => p.id === player.id);
        players.splice(index, 1);
        if (timeouts[player.id]) {
            clearTimeout(timeouts[player.id]);
            delete timeouts[player.id];
        }
        delete playerIdsIndexed[player.id];
        return queue;
    }

    return undefined;
};

const findPlayerQueue = (player, rank) => {
    const rankQueue = global[`${rank}Queue`];
    const playerQueue = rankQueue.find(queue => queue.players.find(p => p.id === player.id));
    return playerQueue ? playerQueue : undefined;   
};

const displayRankQueue = (rank) => {
    const rankQueue = global[`${rank}Queue`];
    const notFullQueue = rankQueue.find(queue => (Object.keys(queue.playerIdsIndexed).length < 2));
    return (notFullQueue) ? notFullQueue : undefined;
};

const deleteQueue = (rank, id, complete) => {
    const rankQueue = global[`${rank}Queue`];
    const index = rankQueue.findIndex(queue => queue.lobby.id === id);
    rankQueue.splice(index, 1);
    if (!complete) global.lobbyId--;
};

module.exports = {
    addPlayerToQueue,
    removePlayerFromQueue,
    findPlayerQueue,
    displayRankQueue,
    deleteQueue
};