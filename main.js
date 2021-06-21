class Square {
  constructor(id) {
    this.id = id;
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
    this.upList = [this.id];
    this.downList = [this.id];
    this.leftList = [this.id];
    this.rightList = [];
    this.occupied = false;
    this.hit = false;
  }

  row() {
    return Math.floor(parseInt(this.id) / 10);
  }

  column() {
    return parseInt(this.id) % 10;
  }
}

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.ship = [];
    this.position = null;
    this.orientation = null;
    this.sunk = false;
  }
}

class Board {
  constructor(name, isEnemy = false) {
    this.name = name;
    this.isEnemy = isEnemy;
    this.squares = {};
    this.ships = {};
  }

  buildBoard() {
    let board = document.createElement("div");
    board.setAttribute("class", "board");
    board.setAttribute("id", `${this.name}-board`);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.createSquare(i, j);
        let square = document.createElement("div");
        square.setAttribute("class", "square");
        if (this.isEnemy) {
          square.className += " unplayed-square";
        }
        square.setAttribute("id", `${10 * i + j}`);
        board.addEventListener("click", (event) =>
          this.squareClicker(event, this)
        );
        board.appendChild(square);
      }
    }
    document.body.appendChild(board);
  }

  createSquare(i, j) {
    let squareId = `${this.name}${10 * i + j}`;
    let squareObject = new Square(squareId);
    //Updates up, down, upList, and downList
    if (i !== 0) {
      squareObject.up = this.squares[`${this.name}${10 * (i - 1) + j}`].id;
      squareObject.upList = this.squares[
        `${this.name}${10 * (i - 1) + j}`
      ].upList.concat(squareObject.upList);
      this.squares[`${this.name}${10 * (i - 1) + j}`].down = squareObject.id;
      squareObject.upList.forEach((ID) => {
        if (ID !== squareObject.id) {
          this.squares[ID].downList.push(squareObject.id);
        }
      });
    }
    //Updates left, right, leftList, and rightList
    if (j % 10 !== 0) {
      squareObject.left = this.squares[`${this.name}${10 * i + j - 1}`].id;
      squareObject.leftList = this.squares[
        `${this.name}${10 * i + j - 1}`
      ].leftList.concat(squareObject.leftList);
      this.squares[`${this.name}${10 * i + j - 1}`].right = squareObject.id;
      squareObject.leftList.forEach((ID) => {
        if (ID !== squareObject.id) {
          this.squares[ID].rightList.push(squareObject.id);
        }
      });
    }
    this.squares[squareId] = squareObject;
  }

  squareClicker(event, object) {
    if (
      event.target.className !== "board" &&
      event.target.className.includes("unplayed-square")
    ) {
      if (object.squares[`${object.name}${event.target.id}`].occupied) {
        event.target.className = "square hit-square";
      } else {
        event.target.className = "square played-square";
      }
    }
  }

  createShips() {
    const shipsAndSizes = [
      ["carrier", 5],
      ["battleship", 4],
      ["submarine", 3],
      ["cruiser", 3],
      ["destroyer", 2],
    ];
    shipsAndSizes.forEach(
      (sAS) => (this.ships[sAS[0]] = new Ship(sAS[0], sAS[1]))
    );
  }

  buildAShip(shipName) {
    let newShip = document.createElement("div");
    newShip.setAttribute("id", shipName);
    newShip.setAttribute("class", "ship");
    let ShipsName = document.createElement("div");
    ShipsName.textContent = shipName;
    newShip.appendChild(ShipsName);
    let spacer = document.createElement("div");
    newShip.appendChild(spacer);
    let thisShip = this.ships[shipName];
    for (let i = 0; i < thisShip.length; i++) {
      let shipSquare = document.createElement("div");
      shipSquare.setAttribute("id", `${thisShip.name}-${i}`);
      shipSquare.setAttribute("class", "ship-square");
      thisShip.ship.push(shipSquare);
      newShip.appendChild(shipSquare);
    }
    return newShip;
  }

  shipyard() {
    const shipyard = document.createElement("div");
    shipyard.setAttribute("id", "shipyard");
    for (let ship in this.ships) {
      console.log(ship);
      let newShip = this.buildAShip(ship);
      shipyard.appendChild(newShip);
    }
    document.body.appendChild(shipyard);
  }
}

class Battleship {
  constructor() {}
}

let player = new Board("player");
player.buildBoard();

player.createShips();

player.shipyard();

//let ai = new Board("ai", true);
//ai.buildBoard();
// ai.squares["ai2"].occupied = true;
