/*----- constants -----*/
const possibleShips = {
  carrier: { name: "carrier", length: 5 },
  battleship: { name: "battleship", length: 4 },
  submarine: { name: "submarine", length: 3 },
  cruiser: { name: "cruiser", length: 3 },
  destroyer: { name: "destroyer", length: 2 },
};

const other = {
  player: "ai",
  ai: "player",
};

/*----- app's state (variables) -----*/
let player,
  shipyard,
  ai,
  stage,
  selectedShip,
  orientation,
  playerBoard,
  startButton,
  orientButton,
  buttons,
  placedShips,
  randomSquare,
  turn,
  gameUpdate,
  gameUpdater,
  gameUpdaterTitle,
  randomOrientation,
  winner,
  shipyardDisplay;

/*----- cached element references -----*/
//  const playerBoardDom = document.querySelector("player-board");
// const aiBoard = document.querySelector("ai-board");
// const shipyard = document.querySelector("shipyard");

/*----- classes -----*/
class Square {
  constructor(id) {
    this.class = "square";
    this.id = `square-${id}`;
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
    this.upList = [];
    this.downList = [];
    this.leftList = [];
    this.rightList = [];
    this.attacked = false;
    this.occupied = false;
  }
}

class Board {
  constructor(name) {
    this.name = name;
    this.squares = {};
    this.ships = {};
    this.remainingShips = 5;
  }

  buildBoard() {
    let board = document.createElement("div");
    board.setAttribute("class", "board");
    board.setAttribute("id", `${this.name}-board`);
    for (let i = 0; i < 100; i++) {
      let newSquare = this.squares[sq(i)]; //THIS IS THE MAJOR PROBLEM.
      let squareDiv = document.createElement("div");
      squareDiv.setAttribute("class", newSquare.class);
      squareDiv.setAttribute("id", newSquare.id);
      board.appendChild(squareDiv);
    }
    return board;
  }

  createSquare(i) {
    let squareId = sq(i);
    let squareObject = new Square(i);
    this.squares[squareId] = squareObject;
    //Updates up, down, upList, and downList
    if (i < 10) {
      squareObject.upList.push(squareId);
    }
    if (i >= 10) {
      let above = sq(i - 10);
      squareObject.up = above;
      squareObject.upList = this.squares[above].upList.concat([squareId]);
      this.squares[above].down = squareId;
      squareObject.upList.forEach((ID) => {
        this.squares[ID].downList.push(squareId);
      });
    }
    //Updates left, right, leftList, and rightList
    if (i % 10 === 0) {
      squareObject.leftList.push(squareId);
    }
    if (i % 10 !== 0) {
      let left = sq(i - 1);
      squareObject.left = left;
      squareObject.leftList = this.squares[left].leftList.concat([squareId]);
      this.squares[left].right = squareId;
      squareObject.leftList.forEach((ID) => {
        this.squares[ID].rightList.push(squareId);
      });
    }
    return squareObject;
  }
}

class Shipyard {
  constructor() {
    this.ships = {
      carrier: {
        name: "carrier",
        length: 5,
        position: [],
        class: "ship",
        health: 5,
      },
      battleship: {
        name: "battleship",
        length: 4,
        position: [],
        class: "ship",
        health: 4,
      },
      submarine: {
        name: "submarine",
        length: 3,
        position: [],
        class: "ship",
        health: 3,
      },
      cruiser: {
        name: "cruiser",
        length: 3,
        position: [],
        class: "ship",
        health: 3,
      },
      destroyer: {
        name: "destroyer",
        length: 2,
        position: [],
        class: "ship",
        health: 2,
      },
    };
  }

  buildShipyard() {
    let shipyard = document.createElement("div");
    shipyard.setAttribute("id", "shipyard");
    for (let ship in this.ships) {
      let shipDiv = this.buildShip(ship);
      shipyard.appendChild(shipDiv);
    }
    return shipyard;
  }

  buildShip(shipName) {
    let thisShip = this.ships[shipName];
    let newShip = document.createElement("div");
    newShip.setAttribute("id", shipName);
    newShip.setAttribute("class", thisShip.class);
    for (let i = 0; i < thisShip.length; i++) {
      let shipSquare = document.createElement("div");
      shipSquare.setAttribute("id", `${shipName}-${i}`);
      shipSquare.setAttribute("class", "ship-square");
      newShip.addEventListener("click", selectAShip);
      newShip.appendChild(shipSquare);
    }
    return newShip;
  }
}

/*----- functions -----*/
function initialize() {
  playerScore = 0;
  aiScore = 0;
  orientButton = document.createElement("button");
  orientButton.setAttribute("id", "orient-button");
  "Rotate".split("").forEach((letter) => {
    let letterDiv = document.createElement("div");
    letterDiv.textContent = letter;
    orientButton.appendChild(letterDiv);
  });

  orientButton.addEventListener("click", () => {
    orientButton.classList.toggle("rotated-button");
    orientation === "leftRight"
      ? (orientation = "upDown")
      : (orientation = "leftRight");
    render();
  });
  startButton = document.createElement("button");
  startButton.setAttribute("id", "start-button");
  startButton.textContent = "Start";
  startButton.addEventListener("click", () => {
    stage = Object.keys(player.ships).length === 5 ? 2 : 1;
    initializeStageTwo();
    render();
  });
  buttons = document.createElement("div");
  startRound();
}

function startRound() {
  document.body.innerHTML = "";
  player = new Board("player");
  shipyard = new Shipyard();
  for (let i = 0; i < 100; i++) {
    player.createSquare(i);
  }
  placedShips = {};
  orientation = "leftRight";
  buttons.setAttribute("id", "buttons");
  buttons.appendChild(orientButton);
  buttons.appendChild(startButton);
  stage = 1;
  render();
}

function initializeStageTwo() {
  playerBoard.removeEventListener("click", (e) => squareClicker(e));
  gameUpdate = [, "No new updates"];
  gameUpdater = document.createElement("div");
  gameUpdater.setAttribute("id", "game-updater");
  gameUpdaterTitle = document.createElement("h1");
  gameUpdaterTitle.textContent = "Game Updates";
  gameUpdater.appendChild(gameUpdaterTitle);

  gameUpdate1 = document.createElement("h2");
  gameUpdate2 = document.createElement("h2");
  gameUpdater.appendChild(gameUpdate1);
  gameUpdater.appendChild(gameUpdate2);

  ai = new Board("ai");
  for (let i = 0; i < 100; i++) {
    ai.createSquare(i);
    ai.squares[sq(i)].class = "unplayed-square";
  }
  placeAIShips();
  turn = 1;
  render();
}

function render() {
  document.body.innerHTML = "";
  //This updates the player board, the shipyard, and the ai board
  playerBoard = player.buildBoard();
  if (stage === 1) {
    playerBoard.addEventListener("click", placeAShip);
    document.body.appendChild(playerBoard);
    shipyardDisplay = shipyard.buildShipyard();
    document.body.appendChild(shipyardDisplay);
    startButton.disabled = Object.keys(player.ships).length < 5;
    document.body.appendChild(buttons);
  } else if (stage === 2) {
    aiBoard = ai.buildBoard();
    playerBoard = player.buildBoard();
    document.body.appendChild(playerBoard);
    document.body.appendChild(aiBoard);
    gameUpdate1.textContent = gameUpdate[0];
    gameUpdate2.textContent = gameUpdate[1];
    document.body.appendChild(gameUpdater);
    aiBoard.addEventListener("click", (e) => attackASquare(e));
  } else {
    document.body.innerHTML = "";
    let winnerBox = document.createElement("div");
    winnerBox.setAttribute("id", "winner-box");
    document.body.appendChild(winnerBox);
    let winningStatement = document.createElement("h1");
    winningStatement.textContent = winner;
    let scores = document.createElement("h2");
    scores.textContent = `Player score: ${playerScore} AI score: ${aiScore}`;
    let playAgainStatement = document.createElement("h2");
    playAgainStatement.textContent = "Would you like to play again?";
    let playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play again";
    playAgainButton.addEventListener("click", () => startRound());
    winnerBox.appendChild(winningStatement);
    winnerBox.appendChild(scores);
    winnerBox.appendChild(playAgainStatement);
    winnerBox.appendChild(playAgainButton);
  }
}

function getWinner() {
  //This checks if a player has won
  if (ai.remainingShips === 0) {
    stage = 3;
    playerScore++;
    return "You won!";
  }
  if (player.remainingShips === 0) {
    stage = 3;
    aiScore++;
    return "The AI won! :(";
  }
}

function sq(i) {
  return `square-${i}`;
}

function unsquare(id) {
  return parseInt(id.split("-")[1]);
}

function isPlaceable(ship, i, side, orientation) {
  if (ship) {
    let length = possibleShips[ship].length;
    if (orientation === "leftRight") {
      for (let j = 0; j < length; j++) {
        if (
          i + j >= 100 ||
          side.squares[sq(i + j)].occupied ||
          (i + j) % 10 < i % 10
        ) {
          return false;
        }
      }
      return true;
    } else {
      for (let j = 0; j < length; j++) {
        if (i + 10 * j >= 100 || side.squares[sq(i + 10 * j)].occupied) {
          return false;
        }
      }
      return true;
    }
  }
}

function placeAShip(e) {
  let i = unsquare(e.target.id);
  if (selectedShip) {
    let length = shipyard.ships[selectedShip].length;
    if (selectedShip && isPlaceable(selectedShip, i, player, orientation)) {
      if (orientation === "leftRight") {
        for (let j = 0; j < length; j++) {
          player.squares[sq(i + j)].occupied = true;
          shipyard.ships[selectedShip].position.push(i + j);
          player.squares[sq(i + j)].class = "occupied-square";
        }
      } else {
        for (let j = 0; j < length; j++) {
          player.squares[sq(i + 10 * j)].occupied = true;
          shipyard.ships[selectedShip].position.push(i + 10 * j);
          player.squares[sq(i + 10 * j)].class = "occupied-square";
        }
      }
      player.ships[selectedShip] = shipyard.ships[selectedShip];
      delete shipyard.ships[selectedShip];
      selectedShip = null;
    }
  }
  render();
}

function placeAIShips() {
  aiShipyard = new Shipyard();
  for (let ship in aiShipyard.ships) {
    do {
      randomSquare = Math.floor(Math.random() * 100);
      randomOrientation = ["leftRight", "upDown"][Math.round(Math.random())];
    } while (!isPlaceable(ship, randomSquare, ai, randomOrientation));
    let length = aiShipyard.ships[ship].length;
    if (randomOrientation === "leftRight") {
      for (let j = 0; j < length; j++) {
        ai.squares[sq(randomSquare + j)].occupied = true;
        aiShipyard.ships[ship].position.push(randomSquare + j);
      }
    } else {
      for (let j = 0; j < length; j++) {
        ai.squares[sq(randomSquare + 10 * j)].occupied = true;
        aiShipyard.ships[ship].position.push(randomSquare + 10 * j);
      }
    }
    ai.ships[ship] = aiShipyard.ships[ship];
  }
}

function selectAShip(e) {
  if (selectedShip) {
    shipyard.ships[selectedShip].class = "ship";
  }
  selectedShip = e.target.id.split("-")[0];
  shipyard.ships[selectedShip].class = "selected-ship";
  render();
}

function attackASquare(e) {
  if (turn % 2 === 1) {
    if (!ai.squares[e.target.id].attacked) {
      checkHit(ai, e.target.id);
      turn++;
      winner = getWinner();
      render();
      if (!winner) {
        AIAttacks();
      }
    }
  }
}

function AIAttacks() {
  if (turn % 2 === 0) {
    do {
      randomSquare = Math.floor(Math.random() * 100);
    } while (player.squares[sq(randomSquare)].attacked);
    checkHit(player, sq(randomSquare));
    turn++;
    winner = getWinner();
    render();
  }
}

function checkHit(side, square) {
  side.squares[square].attacked = true;
  if (side.squares[square].occupied) {
    side.squares[square].class = "hit-square";
    for (let ship in side.ships) {
      if (side.ships[ship].position.includes(unsquare(square))) {
        side.ships[ship].health--;
        if (side.ships[ship].health === 0) {
          sinkShip(ship, side);
          side.remainingShips--;
        }
      }
    }
  } else {
    side.squares[square].class = "miss-square";
  }
}

function sinkShip(ship, side) {
  for (let id of side.ships[ship].position) {
    side.squares[sq(id)].class = "sunk-square";
  }
  gameUpdate.unshift(
    `${other[
      side.name
    ].toUpperCase()} sunk ${side.name.toUpperCase()}'s ${ship}`
  );
}

initialize();
