const tiles = document.querySelectorAll(".tile");
const statusText = document.querySelector("#statusText");
const resetButton = document.querySelector("#resetButton");

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

let options = ["","","","","","","","",""];
let currPlayer = "X";
let running = false;

initGame();

function initGame(){
    tiles.forEach(tile => tile.addEventListener("click", tileClicked));
    resetButton.addEventListener("click",reset);
    statusText.textContent = currPlayer + "'s turn!";
    running = true;
    console.log("Init");
}

function tileClicked(){
    console.log("Clicked");
    const tileInd = this.getAttribute("tileIndex");
    if(options[tileInd] != "" || !running){
        return;
    }
    updateTile(this,tileInd);
    checkState();
}

function updateTile(tile, tileInd){
    console.log("Updating");
    options[tileInd] = currPlayer;
    tile.textContent = currPlayer;
}

function changePlayer(){
    console.log("Changing player");
    currPlayer = (currPlayer == "X") ? "O" : "X";
    statusText.textContent = currPlayer + "'s turn!";
}

function checkState(){
    console.log("Checking state");

    let won = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const tile1 = options[condition[0]];
        const tile2 = options[condition[1]];
        const tile3 = options[condition[2]];
        if(tile1 == "" || tile2 == "" || tile3 == ""){
            continue;
        }
        else if(tile1 == tile2 && tile2 == tile3){
            won = true;
        }
    }

    if(won){
        statusText.textContent = currPlayer + " wins!";
    }
    else if(!options.includes("")){
        statusText.textContent = "It's a draw!";
    }
    else{
        changePlayer();
    }
}

function reset(){
    console.log("Resetting");
    currPlayer = "X";
    options = ["","","","","","","","",""];
    statusText.textContent = currPlayer + "'s turn!";
    tiles.forEach(tile => tile.textContent = "");
    running = true;
}