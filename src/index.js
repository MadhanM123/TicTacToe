//HTML Elements
const tiles = document.querySelectorAll(".tile");
const statusText = document.querySelector("#statusText");
const resetButton = document.querySelector("#resetButton");
const multiButton = document.querySelector("#multiplayerButton");
const compButton = document.querySelector("#computerButton");

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

//Computer mode variables
let compMode;
let hPlayer,cPlayer;


//GENERAL FUNCTIONS

//Initializes buttons and text
function initGame(){
    tiles.forEach(tile => tile.addEventListener("click", tileClicked));
    resetButton.addEventListener("click",reset);
    multiButton.addEventListener("click",multiSetup);
    compButton.addEventListener("click",compSetup);
    statusText.textContent = "Pick a mode!";
    running = true;
}

//Response to a tile click
function tileClicked(){
    let tileInd = this.getAttribute("tileIndex");
    if(board[tileInd] != "" || !running){
        return;
    }
    updateTile(this,tileInd,currPlayer);
    const s = checkState();
    if(s != 2){
        tiles.forEach(tile => tile.disabled = true);
    }
    if(!compMode){
        return;
    }

    //For Computer Mode
    let c = bestSpot();
    updateTile(document.getElementById("t" + c),c,cPlayer);
    if(checkState() != 2){
        tiles.forEach(tile => tile.disabled = true);
    }
}

//Updates given tile with symbol
function updateTile(tile, tileInd, player){
    board[tileInd] = player;
    tile.textContent = player;
}

//Changes the current player
function changePlayer(){
    currPlayer = altPlayer(currPlayer);
    statusText.textContent = currPlayer + "'s turn!";
}

//Displays state message or changes player
function checkState(){
    if(boardState(board,currPlayer)){
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

//Resets all buttons/variables
function reset(){
    currPlayer = "X";
    board = ["","","","","","","","",""];
    tiles.forEach(tile => tile.textContent = "");
    tiles.forEach(tile => tile.disabled = true);
    resetButton.disabled = true;
    compButton.disabled = false;
    multiButton.disabled = false;
    statusText.textContent = "Pick a mode!";
    hPlayer = null;
    cPlayer = null;
    running = false;
}

//MULTIPLAYER FUNCTIONS:

//Sets up multiplayer mode
function multiSetup(){
    multiButton.disabled = true;
    compButton.disabled = true;
    tiles.forEach(tile => tile.disabled = false);
    resetButton.disabled = false;
    statusText.textContent = currPlayer + "'s turn!";
    compMode = false;
    running = true;
}

//HELPER FUNCTIONS:

//Checks the state of the board
function boardState(board,player){
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

//Ternary for changing player
function altPlayer(player){
    return ("X" == player) ? "O" : "X";
}

//Finds max score
function scoreMax(arr){
    let max = -11;
    let ind = 0;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].score > max){
            max = arr[i].score;
            ind = i;
        }
    }
    return ind;
}

//Finds minimum score
function scoreMin(arr){
    let min = 11;
    let ind = 0;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].score < min){
            min = arr[i].score;
            ind = i;
        }
    }
    return ind;
}

//COMPUTER MODE FUNCTIONS:

//Sets up computer mode
function compSetup(){
    multiButton.disabled = true;
    compButton.disabled = true;
    tiles.forEach(tile => tile.disabled = false);
    resetButton.disabled = false;
    statusText.textContent = currPlayer + "'s turn!";
    compMode = true;
    hPlayer = "X";
    cPlayer = "O";
    running = true;
}

//Grabs best spot
function bestSpot() {
    return minimax(board,currPlayer).index;
}

//Recursive algorithm to evaluate best move
function minimax(board,player){
    if(boardState(board,hPlayer)){
        return {score : -10};
    }
    else if(boardState(board,cPlayer)){
        return {score : 10};
    }
    else if(!board.includes("")){
        return {score : 0};
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
    if(player == cPlayer){
        bestMove = scoreMax(moves);
    }
    else{
        bestMove = scoreMin(moves);
    }
    return moves[bestMove];
}

//Starts game
initGame();