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
    return Math.floor(parseInt(id) / 10);
  }

  column() {
    return parseInt(id) % 10;
  }
}

class Board {
  constructor(name) {
    this.name = name;
    this.squares = {};
  }

  buildBoard() {
    let board = document.createElement("div");
    board.setAttribute("class", "board");
    board.setAttribute("id", `${this.name}-board`);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.createSquare(i, j);
        let square = document.createElement("div");
        square.setAttribute("class", "unplayed-square");
        square.setAttribute("id", `${10 * i + j}`);
        board.appendChild(square);
      }
    }
    document.body.appendChild(board);
  }

  isEnemy(){
    document.querySelector(`#${this.name}-board`).addEventListener("click", (event) => this.squareClicker(event,this));
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

  squareClicker(event,object) {
    if (
      event.target.className !== "board" &&
      event.target.className === "unplayed-square"
    ) {
      if (object.squares[`${object.name}${event.target.id}`].occupied) {
        event.target.setAttribute("class", "hit-square");
      } else {
        event.target.setAttribute("class", "played-square");
      }
    }
  }
}

class Battleship {
  constructor() {}
}

let player = new Board("player");
player.buildBoard();

let ai = new Board("ai");
ai.buildBoard();
ai.isEnemy();


ai.squares['ai2'].occupied=true;
