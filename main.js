//constants

class PlayedSquare {
  constructor(id, team) {
    this.id = id;
    this.team = team;
    this.left = [this.id];
    this.up = [this.id];
    this.upleft = [this.id];
    this.downleft = [this.id];
  }
}

const teamColors = ["red", "blue", "yellow", "purple", "green", "orange"];
const dice = {
  die1: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  die2: [0, 0, 1, 0, 0, 0, 1, 0, 0],
  die3: [0, 0, 1, 0, 1, 0, 1, 0, 0],
  die4: [1, 0, 1, 0, 0, 0, 1, 0, 1],
  die5: [1, 0, 1, 0, 1, 0, 1, 0, 1],
  die6: [1, 1, 1, 0, 0, 0, 1, 1, 1],
};

const playedNumbers = {};

const directions = ["left", "up", "upleft", "downleft"];

//state variables
let numOfTeams,
  turn,
  updatedConnected,
  isAWinner,
  timer,
  minute,
  second,
  isTimerStopped;

//cache elements
const diceBox = document.querySelector("#dice");
const colorBox = document.querySelector("#colors");

//event listeners
document
  .querySelector("#teamCountConfirm")
  .addEventListener("click", teamConfirm);

diceBox.addEventListener("click", rollDice);

//functions
function initialize() {
  turn = 0;
  timer=0;
  const entryBox = document.createElement("input");
  entryBox.setAttribute("id", "entryBox");
  document.querySelector("#entry").appendChild(entryBox);
  const confirm = document.createElement("button");
  confirm.textContent = "Confirm";
  confirm.setAttribute("id", "confirmButton");
  confirm.addEventListener("click", numberConfirm);
  document.querySelector("#entry").appendChild(confirm);
  diceBox.innerHTML = `<h1>Roll to Start</h1>`
  render();
  makeBoard();
}
//init function

function pregameRender() {
  let numberOfTeams = document.querySelector("#numberOfTeams").value;
  document.querySelector("#teamCount").textContent = numberOfTeams;
  document.querySelector("#numberOfTeams").oninput = function () {
    numberOfTeams = this.value;
    document.getElementById("teamCount").innerHTML = numberOfTeams;
  };
}

//render function
function render() {
  colorBox.innerHTML = "";
  for (let i = 0; i < numOfTeams; i++) {
    let row = document.createElement("div");
    row.textContent = `Team ${i + 1}`;
    row.style.backgroundColor = teamColors[i];
    if ((turn - i) % numOfTeams === 0) {
      row.style.border = "2pt solid black";
      row.style.fontSize = "20pt";
    }
    colorBox.appendChild(row);
  }
}

function makeDie(num) {
  let die = document.createElement("div");
  die.setAttribute("class", "die");
  dice[`die${num}`].forEach((elt) => {
    let pip = document.createElement("span");
    pip.innerHTML = elt === 1 ? "&#9679;" : "";
    die.appendChild(pip);
  });
  return die;
}

function rollDice() {
  if (timer <= 0) {
    diceBox.innerHTML = "";
    for (let i = 1; i <= 4; i++) {
      let roll = 1 + Math.floor(Math.random() * 6);
      let num = makeDie(roll);
      diceBox.appendChild(num);
    }
    timer = 4 * 60000;
    timerUpdate();
  }
}

function makeBoard() {
  document.querySelector("#futureBoard").innerHTML = "";
  let board = document.createElement("div");
  board.setAttribute("id", "board");
  for (i = 0; i < 10; i++) {
    for (j = 1; j <= 10; j++) {
      let box = document.createElement("div");
      box.setAttribute("class", "box");
      box.setAttribute("id", `box${10 * i + j}`);
      box.innerHTML = `<span>${10 * i + j}<span>`;
      board.appendChild(box);
    }
  }
  document.querySelector("#futureBoard").appendChild(board);
}

function teamConfirm() {
  numOfTeams = document.querySelector("#numberOfTeams").value;
  document.body.removeChild(document.querySelector("#pregame"));
  initialize();
}

function timerUpdate() {
  if (timer >= 0) {
    minute = Math.floor(timer / 60000);
    second = Math.ceil((timer - 60000 * minute) / 1000).toString();
    second = second.length === 2 ? second : "0" + second;
    document.querySelector("#timer").textContent = `${minute}:${second}`;
    setTimeout(() => {
      timer -= 1000;
      timerUpdate();
    }, 1000);
  }
}

function numberConfirm() {
  let inputNumber = document.querySelector("#entryBox").value;
  if (
    inputNumber % 1 === 0 &&
    inputNumber > 0 &&
    inputNumber < 101 &&
    !Object.keys(playedNumbers).includes(`#box${inputNumber}`)
  ) {
    let played = new PlayedSquare(`#box${inputNumber}`, turn % numOfTeams);
    playedNumbers[played.id] = played;
    document.querySelector(`#box${inputNumber}`).style.backgroundColor =
      teamColors[turn % numOfTeams];
    update(inputNumber);
    if (checkWin(inputNumber)) {
      return (document.body.innerHTML = `<h1>Team ${
        (turn % numOfTeams) + 1
      } Wins!`);
    }
    turn++;
    timer = 0;
    diceBox.innerHTML = `<h1>Roll to Start</h1>`
    render();
  }
  document.querySelector("#entryBox").value = "";
}

function updateDirection(id, distance, direction, possibleCallback) {
  if (
    possibleCallback(id) &&
    (!!playedNumbers[`#box${parseInt(id) + distance}`]
      ? playedNumbers[`#box${parseInt(id) + distance}`].team ===
        turn % numOfTeams
      : false)
  ) {
    updatedConnected = playedNumbers[`#box${id}`][direction].concat(
      playedNumbers[`#box${parseInt(id) + distance}`][direction]
    );
    playedNumbers[`#box${id}`][direction] = updatedConnected;
    for (let playedId of playedNumbers[`#box${parseInt(id) + distance}`][
      direction
    ]) {
      playedNumbers[playedId][direction] = updatedConnected;
    }
  }
}

function update(id) {
  //Check up:
  updateDirection(id, -10, "up", (x) => x > 10);
  //Check up:
  updateDirection(id, 10, "up", (x) => x < 91);
  //Check left:
  updateDirection(id, -1, "left", (x) => x % 10 !== 1);
  //Check right:
  updateDirection(id, 1, "left", (x) => x % 10 !== 0);
  //Check up-left diagonal:
  updateDirection(id, -11, "upleft", (x) => x % 10 !== 1 && x > 10);
  //Check down-right diagonal:
  updateDirection(id, 11, "upleft", (x) => x % 10 !== 0 && x > 10);
  //Check down-left diagonal:
  updateDirection(id, 9, "downleft", (x) => x % 10 !== 1 && x < 91);
  //Check up-right diagonal:
  updateDirection(id, -9, "downleft", (x) => x % 10 !== 0 && x < 91);
}

function checkWin(id) {
  for (let point of directions) {
    if (playedNumbers[`#box${id}`][point].length >= 4) {
      return true;
    }
  }
  return false;
}

////// TEST
pregameRender();
window.addEventListener("beforeunload", function (event) {
  return;
});
