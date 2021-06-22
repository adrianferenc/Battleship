/*----- constants -----*/
const possibleShips = {
  carrier: { name: "carrier", length: 5 },
  battleship: { name: "battleship", length: 4 },
  submarine: { name: "submarine", length: 3 },
  cruiser: { name: "cruiser", length: 3 },
  destroyer: { name: "destroyer", length: 2 },
};

/*----- app's state (variables) -----*/
let player, shipyard, ai, stage, selectedShip, orientation, playerBoard;

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
    if (i >= 10) {
      let above = sq(i - 10);
      squareObject.up = above;
      squareObject.upList = this.squares[above].upList.concat([squareId]);
      this.squares[above].down = squareId;
      squareObject.upList.forEach((ID) => {
        if (ID !== squareId) {
          this.squares[ID].downList.push(squareId);
        }
      });
    }
    //Updates left, right, leftList, and rightList
    if (i % 10 !== 0) {
      let left = sq(i - 1);
      squareObject.left = left;
      squareObject.leftList = this.squares[left].leftList.concat([squareId]);
      this.squares[left].right = squareId;
      squareObject.leftList.forEach((ID) => {
        if (ID !== squareId) {
          this.squares[ID].rightList.push(squareId);
        }
      });
    }
    return squareObject;
  }
}

class Shipyard {
  constructor() {
    this.ships = {
      carrier: { name: "carrier", length: 5, placed: false },
      battleship: { name: "battleship", length: 4, placed: false },
      submarine: { name: "submarine", length: 3, placed: false },
      cruiser: { name: "cruiser", length: 3, placed: false },
      destroyer: { name: "destroyer", length: 2, placed: false },
    };
  }

  buildShipyard() {
    let shipyard = document.createElement("div");
    shipyard.setAttribute("id", "shipyard");
    for (let ship in this.ships) {
      if (!this.ships[ship].placed) {
        let shipDiv = this.buildShip(ship);
        shipyard.appendChild(shipDiv);
      }
    }
    return shipyard;
  }

  buildShip(shipName) {
    let newShip = document.createElement("div");
    newShip.setAttribute("id", shipName);
    newShip.setAttribute("class", "ship");
    let thisShip = this.ships[shipName];
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
  //This starts the game and initializes all necessary variables.
  player = new Board("player");
  ai = new Board("ai");
  shipyard = new Shipyard();
  for (let i = 0; i < 100; i++) {
    player.createSquare(i);
    ai.createSquare(i);
  }
  orientation = "leftRight";
  stage = 1;
  render(player, shipyard, ai);
}

function startRound() {
  //This starts a particular game of battleship.
}

function getWinner() {
  //This checks if a player has won
}

function render() {
  document.body.innerHTML = "";
  //This updates the player board, the shipyard, and the ai board
  playerBoard = player.buildBoard();
  playerBoard.addEventListener("click", (e) => squareClicker(e));
  playerBoard.addEventListener("click", placeAShip);
  //updateSquares()
  document.body.appendChild(playerBoard);
  if (stage === 1) {
    let shipyardDisplay = shipyard.buildShipyard();
    document.body.appendChild(shipyardDisplay);
  } else if (stage === 2) {
    playerBoard.removeEventListener("click", (e) => squareClicker(e));
    let aiBoard = ai.buildBoard();
    document.body.appendChild(aiBoard);
  }
}

// function updateSquares(){
//     for (let square in player.squares){
//         console.log(square);
//         if (square.occupied){
//             console.log(square);
//             square.class = 'occupied-square';
//         }
//     }
// }

function sq(i) {
  return `square-${i}`;
}

function unsquare(id) {
  return parseInt(id.split("-")[1]);
}

function squareClicker(e) {
  // This should allow the squares to change color under certain circumstances. This is done by changing the class of the square object in the squares object.
  //let squareId = e.target.id;
}

function placeAShip(e) {
  let i = unsquare(e.target.id);
  if (selectedShip) {
    let length = possibleShips[selectedShip].length;
    if (selectedShip && isPlaceable(selectedShip, i)) {
      if (orientation === "leftRight") {
        for (let j = 0; j < length; j++) {
          player.squares[sq(i + j)].occupied = true;
          player.squares[sq(i + j)].class = "occupied-square";
        }
      }
      delete shipyard.ships[selectedShip];
      selectedShip = null;
    }
  }
  render();
}

function selectAShip(e) {
  selectedShip = e.target.id.split("-")[0];
}
// if (isPlaceable(selectedShip,unsquare(e.target.id))){
//     console.log('niceee');
// }

//This should select a ship. It will do multiple things (so will possible be made up of several functions). It sets selectedShip to the selected ship. It activates an eventlistener which uses mouseover and shows in some way where the ship would be placed if clicked. It also adds a click event listener that would set the ship in place.
//   let idx = shipsAndSizes
//     .map((sAS) => sAS[0])
//     .indexOf(event.target.id.split("-")[0]);
//   let id = shipsAndSizes[idx];
//   if (id + 1) {
//     if (attachedPlacementListener) {
//       document
//         .querySelector(`#${name}-board`)
//         .removeEventListener("mouseover", () => this.placeAShip());
//       //   attachedPlacementListener=false;
//     }
//     if (this.selectedShip && this.selectedShip[0] === id[0]) {
//       document
//         .querySelector(`#${this.selectedShip[0]}`)
//         .classList.remove("selected-ship");
//       document
//         .querySelector(`#${name}-board`)
//         .removeEventListener("mouseover", () => this.placeAShip());
//       this.selectedShip = null;
//     } else {
//       document.querySelector(`#${id[0]}`).classList.add("selected-ship");
//       this.selectedShip = id;
//       document
//         .querySelector(`#${name}-board`)
//         .addEventListener("mouseover", () => this.placeAShip());
//       attachedPlacementListener = true;
//     }
//   }

function isPlaceable(ship, i) {
  if (selectedShip) {
    let length = possibleShips[ship].length;
    if (orientation === "leftRight") {
      for (let j = 0; j < length; j++) {
        if (
          i + j >= 100 ||
          player.squares[sq(i + j)].occupied ||
          (i + j) % 10 < i % 10
        ) {
          return false;
        }
      }
      return true;
    }
  }
}

initialize();

/*----- event listeners -----*/

// let ai = new Board("ai", true);
// ai.buildBoard();
// ai.squares["ai2"].occupied = true;
