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
    statusText.textContent = currPlayer + "'s turn!";
    running = true;
    console.log("Init");
}

function tileClicked(){
    console.log("Clicked");
    const tileInd = this.getAttribute("tileIndex");
    if(board[tileInd] != "" || !running){
        return;
    }
    updateTile(this,tileInd);
    checkState();
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
    }
    else if(!board.includes("")){
        statusText.textContent = "It's a draw!";
    }
    else{
        changePlayer();
    }
}

function reset(){
    console.log("Resetting");
    currPlayer = "X";
    board = ["","","","","","","","",""];
    statusText.textContent = currPlayer + "'s turn!";
    tiles.forEach(tile => tile.textContent = "");
    running = true;
}

function multiSetup(){
    console.log("Setting up multi");
    multiButton.disabled = true;
    compButton.disabled = true;
    tiles.forEach(tile => tile.disabled = false);
    resetButton.disabled = false;
    compMode = false;
}

//Helpers
function altPlayer(player){
    return ("X" == player) ? "O" : "X";
}

function moveMin(arr){
    let ind = 0;

    for(let i = 1; i < arr.length; i++){
        if(arr[i].score < arr[ind].score){
            ind = i;
        }
    }

    return ind;
}

function moveMax(arr){
    let ind = 0;

    for(let i = 1; i < arr.length; i++){
        if(arr[i].score > arr[ind].score){
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
    compMode = true;
}

function compControl(){
    let move = minimax(currPlayer,board);
    updateTile()
}

function findMove(){
    let move = minimax(currPlayer,board);

}

function compScore(player){
    if(boardState(player)){
        return 10;
    }
    else if(boardState(altPlayer(player))){
        return -10;
    }
    else{
        return 0;
    }
}

function minimax(player,game){
    if(!game.includes("")) return compScore(player);

    let moves = [];
    let moveScores = [];
    let temp = []; 
    let move = {};

    for(let i = 0; i < game.length; i++){
        if(game[i] == ""){
            continue;
        }
        move.ind = i;
        temp = game.slice(0);
        temp[i] = player;
        let result = minimax(altPlayer(player),temp);

        move.score = result.score;
        moves.push(move);
    }

    let ind;
    let choice;
    if(currPlayer == player){
        ind = moveMax(moves);
        choice = moves[ind].ind;
    }
    else{
        ind = moveMin(moves);
        choice = moves[ind].ind;
    }

    return moves[choice];
}

