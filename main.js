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
  randomOrientation,
  winner,
  shipyardDisplay;

  //This starts the game and initializes all necessary variables.
  player = new Board("player");
  shipyard = new Shipyard();
  for (let i = 0; i < 100; i++) {
    player.createSquare(i);
  }
  placedShips = {};
  orientation = "leftRight";
  orientButton = document.createElement("button");
  orientButton.setAttribute("id", "orient-button");
  orientButton.innerText = "Rotate";
  orientButton.addEventListener("click", () => {
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
  buttons.setAttribute("id", "buttons");
  buttons.appendChild(orientButton);
  buttons.appendChild(startButton);
  stage = 1;
  render(player, shipyard, ai);
}

function initializeStageTwo() {
  playerBoard.removeEventListener("click", (e) => squareClicker(e));
  gameUpdater = document.createElement("h2");
  ai = new Board("ai");
  for (let i = 0; i < 100; i++) {
    ai.createSquare(i);
    ai.squares[sq(i)].class = "unplayed-square";
  }
  placeAIShips();
  turn = 1;
  render();
}

function getWinner() {
  //This checks if a player has won
  if (ai.remainingShips === 0) {
    stage = 3;
    return "You won!";
  }
  if (player.remainingShips === 0) {
    stage = 3;
    return "The AI won! :(";
  }
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
    gameUpdater.textContent = gameUpdate;
    document.body.appendChild(gameUpdater);
    aiBoard.addEventListener("click", (e) => attackASquare(e));
  } else {
    document.body.innerHTML = "";
    let winningStatement = document.createElement("h1");
    winningStatement.textContent = winner;
    let playAgainStatement = document.createElement("h2");
    playAgainStatement.textContent = "Would you like to play again?";
    let playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play again";
    playAgainButton.addEventListener("click", () => initialize());
    document.body.appendChild(winningStatement);
    document.body.appendChild(playAgainStatement);
    document.body.appendChild(playAgainButton);
  }
}

function sq(i) {
  return `square-${i}`;
}

function unsquare(id) {
  return parseInt(id.split("-")[1]);
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

function attackASquare(e) {
  gameUpdate = "";
  if (turn % 2 === 1) {
    if (!ai.squares[e.target.id].attacked) {
      checkHit(ai, e.target.id);
      turn++;
      winner = getWinner();
      render();
      AIAttacks();
    }
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
  gameUpdate = `${other[
    side.name
  ].toUpperCase()} sunk ${side.name.toUpperCase()}'s ${ship}`;
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

initialize();
