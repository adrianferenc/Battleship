//constants
const teamColors = ["red", "blue", "yellow", "purple", "green", "orange"];
const dice = {
  die1: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  die2: [0, 0, 1, 0, 0, 0, 1, 0, 0],
  die3: [0, 0, 1, 0, 1, 0, 1, 0, 0],
  die4: [1, 0, 1, 0, 0, 0, 1, 0, 1],
  die5: [1, 0, 1, 0, 1, 0, 1, 0, 1],
  die6: [1, 1, 1, 0, 0, 0, 1, 1, 1],
};

//state variables
let numOfTeams, turn;

//cache elements
const diceBox = document.querySelector("#dice");


//event listeners
document
  .querySelector("#teamCountConfirm")
  .addEventListener("click", teamConfirm);

//functions
function initialize() {
    turn = 0;
    const entryBox = document.createElement('input');
    entryBox.setAttribute('id','entryBox');
    document.querySelector('#entry').appendChild(entryBox)
    render()
}
//init function

function pregameRender() {
  let n = document.querySelector("#numberOfTeams").value;
  document.querySelector("#teamCount").textContent = n;
  document.querySelector("#numberOfTeams").oninput = function () {
    n = this.value;
    document.getElementById("teamCount").innerHTML = n;
  };
}

//render function
function render() {
  for (let i = 1; i <= 4; i++) {
    let num = makeDie(rollDie());
    diceBox.appendChild(num);
  }
  makeBoard();
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

function rollDie() {
  return 1 + Math.floor(Math.random() * 6);
}

function makeBoard() {
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
  document.querySelector('#futureBoard').appendChild(board);
}

function teamConfirm() {
  numOfTeams = document.querySelector("#numberOfTeams").value;
  document.body.removeChild(document.querySelector("#pregame"));
  console.log(numOfTeams);
  initialize();
}

////// TEST
pregameRender();
window.addEventListener("beforeunload", function (event) {
  return;
});
