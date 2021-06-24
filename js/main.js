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
let ai,
  buttonBox,
  buttons,
  currentDirection,
  found,
  gameUpdate,
  gameUpdates,
  gameUpdaterTitle,
  mainStage,
  max,
  orientation,
  orientButton,
  placedShips,
  player,
  playerBoard,
  randomOrientation,
  randomSquare,
  selectedShip,
  shipyard,
  shipyardDisplay,
  stage,
  stageOne,
  stageTwo,
  startButton,
  title,
  turn,
  update,
  winner;

/*----- cached element references -----*/

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
      let newSquare = this.squares[numToId(i)];
      let squareDiv = document.createElement("div");
      squareDiv.setAttribute("class", newSquare.class);
      squareDiv.setAttribute("id", newSquare.id);
      board.appendChild(squareDiv);
    }
    return board;
  }

  createSquare(i) {
    let squareId = numToId(i);
    let squareObject = new Square(i);
    this.squares[squareId] = squareObject;
    //Updates up, down, upList, and downList
    if (i < 10) {
      squareObject.upList.push(squareId);
    }
    if (i >= 10) {
      let above = numToId(i - 10);
      squareObject.up = above;
      squareObject.upList = this.squares[above].upList.concat([squareId]);
      this.squares[above].down = squareId;
    }
    squareObject.upList.forEach((ID) => {
      this.squares[ID].downList.push(squareId);
    });
    //Updates left, right, leftList, and rightList
    if (i % 10 === 0) {
      squareObject.leftList.push(squareId);
    }
    if (i % 10 !== 0) {
      let left = numToId(i - 1);
      squareObject.left = left;
      squareObject.leftList = this.squares[left].leftList.concat([squareId]);
      this.squares[left].right = squareId;
    }
    squareObject.leftList.forEach((ID) => {
      this.squares[ID].rightList.push(squareId);
    });
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
        class: orientation === "ship",
        health: 5,
      },
      battleship: {
        name: "battleship",
        length: 4,
        position: [],
        class: orientation === "ship",
        health: 4,
      },
      submarine: {
        name: "submarine",
        length: 3,
        position: [],
        class: orientation === "ship",
        health: 3,
      },
      cruiser: {
        name: "cruiser",
        length: 3,
        position: [],
        class: orientation === "ship",
        health: 3,
      },
      destroyer: {
        name: "destroyer",
        length: 2,
        position: [],
        class: orientation === "ship",
        health: 2,
      },
    };
  }

  buildShipyard() {
    let shipyard = document.createElement("div");
    shipyard.setAttribute("id", "shipyard");
    shipyard.setAttribute(
      "class",
      orientation === "leftRight" ? "shipyardRL" : "shipyardUD"
    );
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
  buttonBox = document.createElement("div");
  buttonBox.setAttribute("id", "button-box");
  buttonBox.appendChild(orientButton);
  orientButton.setAttribute("id", "orient-button");
  "Rotate".split("").forEach((letter) => {
    let letterDiv = document.createElement("div");
    letterDiv.textContent = letter;
    orientButton.appendChild(letterDiv);
  });
  startButton = document.createElement("button");
  startButton.setAttribute("id", "start-button");
  startButton.textContent = "Start";
  startButton.addEventListener("click", () => {
    stage = Object.keys(player.ships).length === 5 ? 2 : 1;
    initializeStageTwo();
    render();
  });
  title = document.createElement("h1");
  title.textContent = "Battleship";
  mainStage = document.createElement("div");
  mainStage.setAttribute("id", "main-stage");
  startRound();
}

function startRound() {
  document.body.innerHTML = "";
  orientation = "leftRight";
  player = new Board("player");
  shipyard = new Shipyard();
  orientButton.addEventListener("click", () => {
    orientButton.classList.toggle("rotated-button");
    orientation === "leftRight"
      ? (orientation = "upDown")
      : (orientation = "leftRight");

    render();
  });
  orientButton.classList.remove("rotated-button");
  for (let i = 0; i < 100; i++) {
    player.createSquare(i);
  }
  placedShips = {};
  max = {
    id: [],
    max: 0,
  };
  found = [];

  stage = 1;
  stageOne = document.createElement("div");
  stageOne.setAttribute("id", "stage-one");
  render();
}

function initializeStageTwo() {
  playerBoard.removeEventListener("click", (e) => squareClicker(e));
  gameUpdate = [, "No new updates"];
  gameUpdater = document.createElement("div");
  gameUpdater.setAttribute("id", "game-updater");
  gameUpdaterTitle = document.createElement("h1");
  gameUpdaterTitle.setAttribute("id", "game-updater-title");
  gameUpdaterTitle.textContent = "Game Updates";
  gameUpdater.appendChild(gameUpdaterTitle);
  gameUpdates = document.createElement("ul");
  gameUpdates.setAttribute("id", "game-updates");
  gameUpdater.appendChild(gameUpdates);

  ai = new Board("ai");
  for (let i = 0; i < 100; i++) {
    ai.createSquare(i);
    ai.squares[numToId(i)].class = "unplayed-square";
  }
  placeAIShips();
  turn = 1;
  stageTwo = document.createElement("div");
  stageTwo.setAttribute("id", "stage-two");
  render();
}

function render() {
  mainStage.innerHTML = "";
  //This updates the player board, the shipyard, and the ai board
  playerBoard = player.buildBoard();
  if (stage === 1) {
    if (orientation === "leftRight") {
      for (let ship in shipyard.ships) {
        if (
          !!shipyard.ships[ship].class &&
          shipyard.ships[ship].class.includes("selected-ship")
        ) {
          shipyard.ships[ship].class = "selected-ship";
        } else {
          shipyard.ships[ship].class = "ship";
        }
      }
    } else if (orientation === "upDown") {
      for (let ship in shipyard.ships) {
        if (
          !!shipyard.ships[ship].class &&
          shipyard.ships[ship].class.includes("selected-ship")
        ) {
          shipyard.ships[ship].class = "selected-ship-rotated";
        } else {
          shipyard.ships[ship].class = "ship-rotated";
        }
      }
    }
    shipyardDisplay = shipyard.buildShipyard();
    playerBoard.addEventListener("click", placeAShip);
    mainStage.appendChild(playerBoard);
    mainStage.appendChild(buttonBox);
    mainStage.appendChild(shipyardDisplay);
    startButton.disabled = Object.keys(player.ships).length < 5;
    stageOne.appendChild(title);
    stageOne.appendChild(mainStage);
    stageOne.appendChild(startButton);
    document.body.appendChild(stageOne);
  } else if (stage === 2) {
    stageOne.innerHTML = "";
    aiBoard = ai.buildBoard();
    aiBoard.addEventListener("click", (e) => attackASquare(e));
    playerBoard = player.buildBoard();
    mainStage.appendChild(playerBoard);
    mainStage.appendChild(aiBoard);
    stageTwo.appendChild(mainStage);
    stageTwo.appendChild(gameUpdater);
    document.body.appendChild(stageTwo);
  } else {
    document.body.innerHTML = "";
    let winnerBox = document.createElement("div");
    winnerBox.setAttribute("id", "winner-box");
    document.body.appendChild(winnerBox);
    let winningStatement = document.createElement("h1");
    winningStatement.innerHTML = winner;
    let scores = document.createElement("h2");
    scores.innerHTML = `Player score: ${playerScore}<br/> AI score: ${aiScore}`;
    let playAgainStatement = document.createElement("h2");
    playAgainStatement.textContent = "Would you like to play again?";
    let playAgainButton = document.createElement("button");
    playAgainButton.setAttribute("id", "play-again-button");
    playAgainButton.textContent = "Play Again";
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
    return "The AI won! &#129302;";
  }
}

function numToId(i) {
  return `square-${i}`;
}

function idToNum(id) {
  return parseInt(id.split("-")[1]);
}

function isPlaceable(ship, i, side, orientation) {
  if (ship) {
    let length = possibleShips[ship].length;
    if (orientation === "leftRight") {
      for (let j = 0; j < length; j++) {
        if (
          i + j >= 100 ||
          side.squares[numToId(i + j)].occupied ||
          (i + j) % 10 < i % 10
        ) {
          return false;
        }
      }
      return true;
    } else {
      for (let j = 0; j < length; j++) {
        if (i + 10 * j >= 100 || side.squares[numToId(i + 10 * j)].occupied) {
          return false;
        }
      }
      return true;
    }
  }
}

function placeAShip(e) {
  let i = idToNum(e.target.id);
  if (selectedShip && e.target.className === "square") {
    let length = shipyard.ships[selectedShip].length;
    if (selectedShip && isPlaceable(selectedShip, i, player, orientation)) {
      if (orientation === "leftRight") {
        for (let j = 0; j < length; j++) {
          player.squares[numToId(i + j)].occupied = true;
          shipyard.ships[selectedShip].position.push(i + j);
          player.squares[numToId(i + j)].class = "occupied-square";
        }
      } else {
        for (let j = 0; j < length; j++) {
          player.squares[numToId(i + 10 * j)].occupied = true;
          shipyard.ships[selectedShip].position.push(i + 10 * j);
          player.squares[numToId(i + 10 * j)].class = "occupied-square";
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
        ai.squares[numToId(randomSquare + j)].occupied = true;
        aiShipyard.ships[ship].position.push(randomSquare + j);
      }
    } else {
      for (let j = 0; j < length; j++) {
        ai.squares[numToId(randomSquare + 10 * j)].occupied = true;
        aiShipyard.ships[ship].position.push(randomSquare + 10 * j);
      }
    }
    ai.ships[ship] = aiShipyard.ships[ship];
  }
}

function selectAShip(e) {
  if (selectedShip) {
    shipyard.ships[selectedShip].class =
      orientation === "leftRight" ? "ship" : "ship-rotated";
  }
  selectedShip = e.target.id.split("-")[0];
  shipyard.ships[selectedShip].class =
    orientation === "leftRight" ? "selected-ship" : "selected-ship-rotated";
  render();
}

function attackASquare(e) {
  if (turn % 2 === 1) {
    if (e.target.className === "unplayed-square") {
      if (!ai.squares[e.target.id].attacked) {
        checkHit(ai, e.target.id);
        turn++;
        winner = getWinner();
        render();
        if (!winner) {
          setTimeout(AIAttacks, 1000);
        }
      }
    }
  }
}

function updateSquares(side, square) {
  let i = idToNum(square);
  //update left, right, up, down:
  if (i % 10 !== 0) {
    side.squares[numToId(i - 1)].right = null;
  }
  if (i % 10 !== 9) {
    side.squares[numToId(i + 1)].left = null;
  }
  if (i >= 10) {
    side.squares[numToId(i - 10)].down = null;
  }
  if (i < 90) {
    side.squares[numToId(i + 10)].up = null;
  }
  //update lists
  for (let j = 0; (10 + i - j) % 10 <= i % 10; j++) {
    side.squares[numToId(i - j)].rightList = side.squares[
      numToId(i - j)
    ].rightList.slice(
      0,
      side.squares[numToId(i - j)].rightList.indexOf(square)
    );
    if ((i - j) % 10 === 0 && j > 0) {
      break;
    }
  }

  for (let j = 0; i % 10 <= (i + j) % 10 && i + j < 100; j++) {
    side.squares[numToId(i + j)].leftList = side.squares[
      numToId(i + j)
    ].leftList.slice(side.squares[numToId(i + j)].leftList.indexOf(square) + 1);
    if ((i + j) % 10 === 0 && j > 0) {
      break;
    }
  }

  for (let j = 0; i - 10 * j >= 0; j++) {
    side.squares[numToId(i - 10 * j)].downList = side.squares[
      numToId(i - 10 * j)
    ].downList.slice(
      0,
      side.squares[numToId(i - 10 * j)].downList.indexOf(square)
    );
    if (i - 10 * j < 10) {
      break;
    }
  }
  for (let j = 0; i + 10 * j < 100; j++) {
    side.squares[numToId(i + 10 * j)].upList = side.squares[
      numToId(i + 10 * j)
    ].upList.slice(
      side.squares[numToId(i + 10 * j)].upList.indexOf(square) + 1
    );
  }
}

function stabInTheDark() {
  for (let i = 0; i < 100; i++) {
    let total =
      Math.min(player.squares[numToId(i)].leftList.length, 5) +
      Math.min(player.squares[numToId(i)].rightList.length, 5) +
      Math.min(player.squares[numToId(i)].downList.length, 5) +
      Math.min(player.squares[numToId(i)].upList.length, 5);
    if (total > max.max) {
      max.max = total;
    }
  }
  for (let i = 0; i < 100; i++) {
    let total =
      Math.min(player.squares[numToId(i)].leftList.length, 5) +
      Math.min(player.squares[numToId(i)].rightList.length, 5) +
      Math.min(player.squares[numToId(i)].downList.length, 5) +
      Math.min(player.squares[numToId(i)].upList.length, 5);
    if (total === max.max) {
      max.id.push(numToId(i));
    }
  }
  return max.id[Math.floor(Math.random() * max.id.length)];
}

function feelingAround() {
  let leftOfFound = numToId(idToNum(found[found.length - 1]) - 1);
  let rightOfFound = numToId(idToNum(found[found.length - 1]) + 1);
  let upOfFound = numToId(idToNum(found[found.length - 1]) - 10);
  let downOfFound = numToId(idToNum(found[found.length - 1]) + 10);
  let foundDirection = [
    [
      (x) => x - 1,
      player.squares[leftOfFound]
        ? player.squares[leftOfFound].leftList.length
        : 0,
    ],
    [
      (x) => x + 1,
      player.squares[rightOfFound]
        ? player.squares[rightOfFound].rightList.length
        : 0,
    ],
    [
      (x) => x - 10,
      player.squares[upOfFound] ? player.squares[upOfFound].upList.length : 0,
    ],
    [
      (x) => x + 10,
      player.squares[downOfFound]
        ? player.squares[downOfFound].downList.length
        : 0,
    ],
  ].sort((x, y) => y[1] - x[1]);
  currentDirection = foundDirection[0][0];
  return currentDirection;
}

function AIAttacks() {
  if (turn % 2 === 0) {
    if (found.length === 0) {
      checkHit(player, stabInTheDark());
    } else if (found.length === 2) {
      checkHit(player, numToId(currentDirection(idToNum(found[1]))));
    } else {
      feelingAround();
      checkHit(player, numToId(currentDirection(idToNum(found[0]))));
    }
    turn++;
    max = { max: 0, id: [] };
    winner = getWinner();
    render();
  }
}

function checkHit(side, square) {
  side.squares[square].attacked = true;
  if (side.squares[square].occupied) {
    side.squares[square].class = "hit-square";
    update = document.createElement("li");
    update.textContent = `${other[side.name].toUpperCase()} got a hit!`;
    gameUpdates.prepend(update);

    if (side.name === "player") {
      if (found.length === 0) {
        found[0] = square;
      } else {
        found[1] = square;
      }
    }
    for (let ship in side.ships) {
      if (side.ships[ship].position.includes(idToNum(square))) {
        side.ships[ship].health--;
        if (side.ships[ship].health === 0) {
          sinkShip(ship, side);
          side.remainingShips--;
          if (side.name === "player") {
            found = [];
            currentDirection = undefined;
          }
        }
      }
    }
  } else {
    side.squares[square].class = "miss-square";
    update = document.createElement("li");
    update.textContent = `${other[side.name].toUpperCase()} missed.`;
    gameUpdates.prepend(update);
    if (side.name === "player" && found.length > 1) {
      found = [found[0]];
    }
  }
  updateSquares(side, square);
}

function sinkShip(ship, side) {
  for (let id of side.ships[ship].position) {
    side.squares[numToId(id)].class = "sunk-square";
  }
  update = document.createElement("li");
  update.style.fontSize = "20pt";
  update.textContent = `${other[
    side.name
  ].toUpperCase()} sunk ${side.name.toUpperCase()}'s ${ship}`;
  gameUpdates.prepend(update);
}

initialize();
