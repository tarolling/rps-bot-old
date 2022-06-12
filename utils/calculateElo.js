const { K, adjustFactor } = require('../config/settings.json');

module.exports = (p1Elo, p2Elo, p1Sigma, p2Sigma) => {
    // sigma values will be decreased depending on each other
    let larger, smaller, expectedWin, expectedLoss;
    if (p1Elo >= p2Elo) {
        larger = Math.pow(10, (p1Elo) / 400);
        smaller = Math.pow(10, (p2Elo) / 400);

        expectedWin = larger / (larger + smaller);
        expectedLoss = smaller / (larger + smaller);
    } else {
        larger = Math.pow(10, (p2Elo) / 400);
        smaller = Math.pow(10, (p1Elo) / 400);

        expectedWin = smaller / (larger + smaller);
        expectedLoss = larger / (larger + smaller);
    }
    
    // returns in the format: [winner's increment, loser's increment]
    return [Math.round(K * (1 - expectedWin)), Math.round((K * (0 - expectedLoss)) + (K / adjustFactor))];
};