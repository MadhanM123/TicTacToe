const tiles = document.querySelectorAll(".tile");
const statusText = document.querySelector("#statusText");
const resetButton = document.querySelector("#resetButton");
const multiButton = document.querySelector("#multiplayerButton");
const compButton = document.querySelector("#computerButton");

let compMode;

const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

let board = ["","","","","","","","",""];
let currPlayer = "X";
let running = false;

initGame();

//General functions

function initGame(){
    tiles.forEach(tile => tile.addEventListener("click", tileClicked));
    resetButton.addEventListener("click",reset);
    multiButton.addEventListener("click",multiSetup);
    compButton.addEventListener("click",compSetup);
    statusText.textContent = "Pick a mode!";
    running = true;
    console.log("Init");
}

function tileClicked(){
    console.log("here")
    let tileInd = this.getAttribute("tileIndex");
    if(board[tileInd] != "" || !running){
        return;
    }
    updateTile(this,tileInd);
    const s = checkState();
    if(s != 2){
        tiles.forEach(tile => tile.disabled = true);
    }
    if(!compMode){
        return;
    }

    //Computer mode
    let c = bestSpot();
    console.log(c);
    updateTile(document.getElementById("t" + c),c);
    if(checkState() != 2){
        tiles.forEach(tile => tile.disabled = true);
    }
}

function updateTile(tile, tileInd){
    console.log("Updating");
    board[tileInd] = currPlayer;
    tile.textContent = currPlayer;
}

function changePlayer(){
    console.log("Changing player");
    currPlayer = altPlayer(currPlayer);
    statusText.textContent = currPlayer + "'s turn!";
}

function boardState(player){
    let won  = false;
    
    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const tile1 = board[condition[0]];
        const tile2 = board[condition[1]];
        const tile3 = board[condition[2]];
        if(tile1 == "" || tile2 == "" || tile3 == ""){
            continue;
        }
        else if(tile1 == tile2 && tile2 == tile3 && tile1 == player){
            won = true;
        }
    }
    return won;
}

function checkState(){
    console.log("Checking state");

    if(boardState(currPlayer)){
        statusText.textContent = currPlayer + " wins!";
        return 1;
    }
    else if(!board.includes("")){
        statusText.textContent = "It's a draw!";
        return 0;
    }
    else{
        changePlayer();
        return 2;
    }
}

function reset(){
    console.log("Resetting");
    currPlayer = "X";
    board = ["","","","","","","","",""];
    tiles.forEach(tile => tile.textContent = "");
    tiles.forEach(tile => tile.disabled = true);
    resetButton.disabled = true;
    compButton.disabled = false;
    multiButton.disabled = false;
    statusText.textContent = "Pick a mode!";
    running = false;
}

function multiSetup(){
    console.log("Setting up multi");
    multiButton.disabled = true;
    compButton.disabled = true;
    tiles.forEach(tile => tile.disabled = false);
    resetButton.disabled = false;
    statusText.textContent = currPlayer + "'s turn!";
    compMode = false;
    running = true;
}

//Helpers
function altPlayer(player){
    return ("X" == player) ? "O" : "X";
}

function scoreMin(arr){
    let ind = 0;

    for(let i = 1; i < arr.length; i++){
        if(arr[i] < arr[ind]){
            ind = i;
        }
    }

    return ind;
}

function scoreMax(arr){
    let ind = 0;

    for(let i = 1; i < arr.length; i++){
        if(arr[i] > arr[ind]){
            ind = i;
        }
    }

    return ind;
}

//Computer mode functions

function compSetup(){
    console.log("Setting up comp");
    multiButton.disabled = true;
    compButton.disabled = true;
    tiles.forEach(tile => tile.disabled = false);
    resetButton.disabled = false;
    statusText.textContent = currPlayer + "'s turn!";
    compMode = true;
    running = true;
}

function compBoardState(player,game){
    let won  = false;
    
    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const tile1 = game[condition[0]];
        const tile2 = game[condition[1]];
        const tile3 = game[condition[2]];
        if(tile1 == "" || tile2 == "" || tile3 == ""){
            continue;
        }
        else if(tile1 == tile2 && tile2 == tile3 && tile1 == player){
            won = true;
            break;
        }
    }
    return won;

}

function compScore(player,game){
    if(compBoardState(player,game)){
        return 10;
    }
    else if(compBoardState(altPlayer(player),game)){
        return -10;
    }
    else{
        return 0;
    }
}

var choice;

// function minimax(player,game){
//     if(!game.includes("")){
//         return compScore(player,game);
//     }

//     let moves = [];
//     let scores = [];

//     for(let i = 0; i < game.length; i++){
//         if(game[i] != ""){
//             continue;
//         }
//         game[i] = player;
//         result = minimax(altPlayer(player),game);
//         scores.push(result);
//         game[i] = "";
//         moves.push(i);
//     }

//     let ind;
//     if(currPlayer == player){
//         ind = scoreMax(scores);
//         choice = moves[ind];
//     }
//     else{
//         ind = scoreMin(scores);
//         choice = moves[ind];
//     }

//     return scores[ind];
// }

function bestSpot() {
    return minimax(board,currPlayer).index;
}

function minimax(board,player){
    if(player == currPlayer){
        if(compBoardState(player,board)){
            return {score : 10};
        }
        else if(compBoardState(altPlayer(player),board)){
            return {score : -10};
        }
        else if(!board.includes("")){
            return {score : 0};
        }

    }
    else if(player != currPlayer){
        if(compBoardState(player,board)){
            return {score : -10};
        }
        else if(compBoardState(altPlayer(player),board)){
            return {score : 10};
        }
        else if(!board.includes("")){
            return {score : 0};
        }
    }

    let moves = [];
    for(let i = 0; i < board.length; i++){
        if(board[i] != "") continue;
        let move = {};
        move.index = i;
        board[i] = player;
        let result = minimax(board,altPlayer(player));
        move.score = result.score;

        board[i] = "";
        moves.push(move);
    }

    let bestMove;
    if(player == currPlayer){
        let bestScore = -11;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else{
        let bestScore = 11;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

