module.exports = async (p1Choice, p2Choice) => {
    if (!(p1Choice && p2Choice)) {
        if (p1Choice) return 'p1';
        if (p2Choice) return 'p2';
    }
    
    switch (p1Choice) {
        case 'Rock':
            switch (p2Choice) {
                case 'Rock':
                    return 'draw';
                case 'Paper':
                    return 'p2';
                case 'Scissors':
                    return 'p1';
            }
            break;
        case 'Paper':
            switch (p2Choice) {
                case 'Rock':
                    return 'p1';
                case 'Paper':
                    return 'draw';
                case 'Scissors':
                    return 'p2';
            }
            break;
        case 'Scissors':
            switch (p2Choice) {
                case 'Rock':
                    return 'p2';
                case 'Paper':
                    return 'p1';
                case 'Scissors':
                    return 'draw';
            }
    }
};