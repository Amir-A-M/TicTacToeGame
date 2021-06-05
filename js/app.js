//  Tic Tac Toe game with alpha beta algorithm

//  هوش مصنوعی (جلسه نوزدهم) - جستجوی رقابتی و هرس آلفا-بتا :     https://youtu.be/RZxyAAwD41o


const restart = document.getElementById('game:restart'),
    winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],
    message = document.querySelector(".message"),
    computerMotionDelay = 250;

var cells = document.querySelectorAll(".cell"),
    emptyCells = 9,
    runningGame = true,
    gameMode = '1p',
    human = "x",
    player_2 = "o",
    computer = player_2,
    currentPlayer = human,

    scores = {
        [human]: -1,
        [computer]: 1,
        tie: 0
    };

if (currentPlayer === computer) computerMove();



cells.forEach((element) => {
    element.addEventListener(
        'click',
        function () {

            // is game running? || is this fill? || if Computer turn
            if (!runningGame || element.fill || (currentPlayer === computer && gameMode === '1p')) return;

            element.fill = true;
            emptyCells--;

            fillCell(element);

            GameCondition(currentPlayer, changeUi);

        }
    )
});


function fillCell(element, add = true, character = currentPlayer) {

    if (add) element.classList.add("fill-" + character);
    else element.classList.remove("fill-" + character);

}

// it's return winner name, tie OR false
function GameCondition(character = currentPlayer, Callback) {
    var wc;
    var turnClass = 'fill-' + character;
    var isWon = winningConditions.some((winningCondition) => {
        var condition = winningCondition.every((i) => {
            return cells[i].classList.contains(turnClass);
        });
        wc = winningCondition;
        return condition;
    });

    var result;
    if (isWon) result = character;
    else if (emptyCells === 0) result = 'tie';
    else result = false;

    if (Callback !== undefined) Callback(wc, character, result);
    return result;

}

// Displays messages, Highlights cells AND Change players' turns
function changeUi(winningCondition, character = currentPlayer, result = GameCondition()) {

    // if some body won
    if (result !== false && result !== 'tie') {
        winningCondition.forEach((e, i) => {
            cells[winningCondition[i]].classList.add("highlight");
        });
        message.innerHTML = "The " + makeTheName().toUpperCase() + " Won";
        runningGame = false;

        // if it's tie
    } else if (result === 'tie') message.innerHTML = "Tie";
    else {

        if (character === human) {

            message.innerHTML = "Current Player " + makeTheName().toUpperCase();

            if (gameMode === '1p') {
                currentPlayer = computer;
                computerMove();
            } else currentPlayer = player_2;

        } else {

            message.innerHTML = "Current Player " + makeTheName().toUpperCase();
            currentPlayer = human;
        }
    }

}

// Computer vs Human    OR     X vs O
function makeTheName(character = currentPlayer) {
    if (gameMode === '1p') {
        return (character !== computer) ? 'Computer' : 'Human';

    } else {
        return (character !== human) ? human : player_2; 

    }
}
function cursor(event) {
    cells.forEach((element) => {
        element.style.cursor = event;
    });
}


// Restart the game
restart.addEventListener('click', reset);
function reset() {

    // reset Classes   Let User To Click Again
    document.querySelectorAll('.cell').forEach((e) => {
        e.classList.remove('fill-o', 'fill-x', 'highlight');
        e.fill = false;
    });

    // reset Equality 
    emptyCells = 9;

    // reset message
    message.innerHTML = 'Start With X';

    // reset turn
    currentPlayer = human

    // reset Condition
    runningGame = true;
}


//  Game Mode :   2 Player    OR    1 Player
document.getElementById('gameMode:1p').addEventListener('click', function() {

    gameMode = '1p'
    reset();
    document.querySelector('.panel .active').classList.remove('active');
    this.classList.add('active');

});
document.getElementById('gameMode:2p').addEventListener('click', function() {

    gameMode = '2p';
    reset();
    document.querySelector('.panel .active').classList.remove('active');
    this.classList.add('active');

});



// AI
function computerMove() {

    //  When the user is waiting for the computer to move
    cursor('context-menu');

    var alpha = -Infinity,
        beta = Infinity,
        value = -Infinity;

    let nicePlace;

    for (let element of cells) {

        // is available?
        if (!element.fill) {

            element.fill = true;
            emptyCells--;
            fillCell(element);

            value = alpha_beta(cells, false, computer, alpha, beta);

            fillCell(element, false);
            emptyCells++;
            element.fill = false;

            if (value >= beta) return value;

            if (value > alpha) {
                alpha = value;
                nicePlace = element;
            }

        }

    }


    setTimeout(() => {

        // Do the movement
        fillCell(nicePlace);
        nicePlace['fill'] = true;
        emptyCells--;
        GameCondition(currentPlayer, changeUi);
        cursor('pointer');

    }, computerMotionDelay);


}

function alpha_beta(arr, isMaximizing, character, alpha, beta) {

    let result = GameCondition(character);
    if (result !== false) return scores[result];


    if (isMaximizing) {

        let value = -Infinity;

        for (let element of arr) {

            if (!element.fill) {

                element.fill = true;
                emptyCells--;
                fillCell(element);

                value = max(value, alpha_beta(arr, false, computer, alpha, beta));

                fillCell(element, false);
                emptyCells++;
                element.fill = false;

                if (value >= beta) return value;

                alpha = max(alpha, value);

            }

        }
        return value

    }
    else {

        let value = Infinity;

        for (let element of arr) {

            if (!element.fill) {

                element.fill = true;
                emptyCells--;
                fillCell(element, true, human);

                value = min(value, alpha_beta(arr, true, human, alpha, beta));

                fillCell(element, false, human);
                emptyCells++;
                element.fill = false;

                if (value <= alpha) return value;

                beta = min(beta, value);

            }

        }
        return value
    }
}


function max(num1, num2) {
    if (num1 > num2) return num1;
    return num2;
}
function min(num1, num2) {
    if (num1 < num2) return num1;
    return num2;
}