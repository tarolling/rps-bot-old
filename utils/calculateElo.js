const { K, minInc, maxInc } = require('../config/settings.json');

module.exports = (winnerElo, loserElo, winnerSigma, loserSigma) => {
    // sigma values will be decreased depending on each other
    let larger, smaller, expectedWin, expectedLoss;
    if (winnerElo >= loserElo) {
        larger = Math.pow(10, (winnerElo) / 400);
        smaller = Math.pow(10, (loserElo) / 400);

        expectedWin = larger / (larger + smaller);
        expectedLoss = smaller / (larger + smaller);
    } else {
        larger = Math.pow(10, (loserElo) / 400);
        smaller = Math.pow(10, (winnerElo) / 400);

        expectedWin = smaller / (larger + smaller);
        expectedLoss = larger / (larger + smaller);
    }

    let winInc = Math.round(K * (1 - expectedWin));
    let loseInc = Math.round(K * (0 - expectedLoss));

    winInc = (winInc < minInc) ? minInc :
        ((winInc > maxInc) ? maxInc : winInc);

    loseInc = (Math.abs(loseInc) < minInc) ? -minInc :
        ((Math.abs(loseInc) > maxInc) ? -maxInc : loseInc);
    
    // Return format: [winner's increment, loser's increment]
    return [winInc, loseInc];
};