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
* Case 1: There will ALWAYS be a queue available for every rank.
* Case 2: A queue does exist for the rank -> Cases 3 & 4.
* Case 3: Player is already in a queue -> Return queue.
* Case 4: Player is not in a queue -> Add player to queue.
*/
const addPlayerToQueue = async (player, rank, timeout) => {
    // There is no existing rank queue
    if (!global[`${rank}Queue`]) {
        console.log('No existing rank queue, making one...');
        global[`${rank}Queue`] = createQueue(rank);
    }

    await new Promise(r => setTimeout(r, 100));

    // Failsafe
    if (Object.keys(global[`${rank}Queue`].playerIdsIndexed).length >= 2) { console.log('Failsafe'); return undefined; }    

    // Player already in queue
    if (global[`${rank}Queue`].playerIdsIndexed[player.id]) { console.log('Player already in queue'); return 'in'; }
    
    // Player not in queue & it has room
    const { players, timeouts, playerIdsIndexed, lobby: { id } } = global[`${rank}Queue`];
    console.log(`Adding ${player.username} to lobby ${id}...`);
    players.push(player);
    playerIdsIndexed[player.id] = player;
    if (timeout) {
        timeouts[player.id] = setTimeout(async () => {
            await removePlayerFromQueue(player, rank);
        }, timeout);
    }
    console.log(`${player.username} added to lobby ${id}!`);
    return global[`${rank}Queue`];
};

const addPlayerToChallenge = async (queue, player) => {
    const { players, playerIdsIndexed } = queue;
    players.push(player);
    playerIdsIndexed[player.id] = player;
    return queue;
}

const removePlayerFromQueue = async (player, rank) => {
    if (!global[`${rank}Queue`]) return undefined;
    
    const playerInQueue = global[`${rank}Queue`].playerIdsIndexed[player.id];
    
    if (!playerInQueue) return undefined;
    
    const { players, playerIdsIndexed, timeouts } = global[`${rank}Queue`];

    if (players.length > 0 && playerIdsIndexed[player.id]) {
        const index = players.findIndex(p => p.id === player.id);
        players.splice(index, 1);
        if (timeouts[player.id]) {
            clearTimeout(timeouts[player.id]);
            delete timeouts[player.id];
        }
        delete playerIdsIndexed[player.id];
        return global[`${rank}Queue`];
    }

    return undefined;
};

const findPlayerQueue = async (player, rank) => {
    const rankQueue = global[`${rank}Queue`];
    const playerQueue = rankQueue.find(queue => queue.playerIdsIndexed[player.id]);
    return playerQueue ? playerQueue : undefined;
};

const displayRankQueue = async (rank) => {
    if (!global[`${rank}Queue`]) return undefined;
    if (Object.keys(global[`${rank}Queue`].playerIdsIndexed).length === 0) return undefined;
    return global[`${rank}Queue`];
};

module.exports = {
    createQueue,
    addPlayerToQueue,
    addPlayerToChallenge,
    removePlayerFromQueue,
    findPlayerQueue,
    displayRankQueue
};