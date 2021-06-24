# Battleship

The game Battleship is created with HTML, CSS, and Javascript.

# How The Game Is Played:
In this game, you will play battleship against an AI. The game works in 2 main stages. The first stage is where the human player places their 5 ships onto their 10x10 grid. Then the second stage starts where each player (human player & AI) go back and forth picking squares on the grid where they believe their opponent has put a ship. When an entire ship is sunk, the other player is alerted. The game proceeds until one player's ships are all sunk, at which point the other player wins.

## A Brief History of Battleship:
The game of Battleship was originally a game played with paper and pencil. It dates back to World War I, where it is questionably disputed if it was created by the French or the Russions.

In 2012, the film Battleship (a movie I have not seen) came out, starring Taylor Kitsch, Alexander Skarsgård, Rihanna, Brooklyn Decker, Tadanobu Asano, and Liam Neeson. It has a 34% rating on Rotten Tomatoes' Tomatometer. Some fun facts about the film (via IMDb):

- The convenience store break-in at the beginning is a parody of a security video posted on YouTube, which went viral, of an actual liquor store break-in. Like the film, the robber climbed from the back of the store and fell down to the same spots from the ceiling twice. Both have the same camera angles and details, such as the foam and ceiling pieces falling down.
- The film utilized 600 extras.
- The film was originally set to be filmed off Australia's Gold Coast. Due to problems with government tax incentives, filming moved to Hawaii.
- Jeremy Renner was cast as Alex Hopper, but dropped out to co-star in The Master (2012), of which he also dropped out.
- The spectrum analyzer used to get the transmission through is an Anritsu MS2713E Spectrum Master.


## Icebox
- Set names of cached elements to define dom elements faster.
- Put outlines around the outside of the ships when placed on the board using border-top-style, border-left-style, etc.
- Let rotate button change shipyard flex-direction to row and flex-direction of the ships to column. Clicking rotate again would undo this.
- If in stage 1, clicking on a ship that has been placed removes it from the board and puts it back at the top of the shipyard.



## My Game

### Stage 1: Placing ships on your board.
- Features of this stage:
	- Player's board where the ships are placed. The board is made up of 100 squares, each with their own id and associated object which stores necessary information. The ship will have a position which is where the top of the ship will be, as well as a direction, which indicates where the rest of the ship goes. 
	- A "shipyard" with the ships that have not been placed yet and can be selected. By default the topmost ship is autoselected. When a ship is hovering over the board, the squares that would be occupied change color.
	- A button that rotates the currently selected ship. It changes the orientation property of the ship.
	- A button that undoes placing a ship and puts it back in the shipyard. It removes the position property of the ship and adds it back to the shipyard div.
	- A start button that only works once all the ships are placed. 

### Stage 2: Playing against AI
- This stage has two parts, one where player makes a move, one where AI makes a move.
- Featuers of this stage:
	- Two boards, the player board, which has the player's ships visible to them, and the AI board, where the player places their moves
	- A "FIRE!" button which locks in the player's move (may remove this)
	- Game updates with text indicating if the shot is a hit or a miss, and whether a hit causes a ship to sink (e.g. "You sunk my battleship!")
- Features of AI board:
	- Ability to click on an unplayed square to select it
	- Ability to click the square again to unselect it
	- Pressing the "FIRE!" button locks in player"s move and lets AI play a turn.
	- Different coloring of squares if the shot is a hit or a miss
- Features of player board:
	- AI moves are displayed on the board. The AI will pick a move next to a hit if it exists. If there are no hits, the AI will find one of the squares that has the most open space above/below/left/right.
	- Display is different if the shot is a hit or a miss.
	- A ship"s visual representation changes when it is sunk.
- The game will recognize when one of the team's ships have all been sunk and declare the other player the winner.


## Pseudocode:

- Overall outline:
	- Stage 1 setup
		- show player's board and the available ships to place
		- once the ships have been placed and start is pressed, move to stage 2
	- Stage 2 setup
		- show player and ai's board and the fire button
	- Stage 2 gameplay
		- allow player to attack on their turn and ai to attack on theirs
	- Announce a winner once one of the players' ships are all sunk

- Stage 1 setup
	- create a square class which makes a single square and has the following functionality:
		- properties, with the parameter of id passed in
			- id, the id of the square
			- up/down/left/right, the square immediately above it, immediately below, immediately to the left, and immediately to the right, all initialized to null
			- upList/downList/..., arrays for all available squares above, all available squares below, ... all initialized to an array containing just the square's id
			- occupied, whether the square is occupied with a ship, initialized to false
			- hit, if the square is hit or not, initialized to false
		- methods
			- row and column methods which return the row/column the square is on in the entire board.

	- create a ship class which has the following functionality:
		- properties, with the parameters of name and length passed in
			- name, ship's name
			- length, ship's length
			- ship, an array containing the ids of the squares the ship is in, initialized to an empty array
			- position, the id of the head of the ship's position on the board, initialized to null
			- orientation, the ship's orientation, i.e. upDown or leftRight, initialized to null
			- sunk, whether the ship is sunk, initialized to false

	- create a board class which has the following functionality:
		- properties, with the parameters of name and isEnemy which is predefined as false if there is no input
			- name, the name of the player, i.e. 'player' or 'ai'
			- isEnemy, whether they're the player or the enemy
			- squares, an object of all the squares on the board, initialized to an empty object
			- ships, an object of all the ships on the board, initialized to an empty object
		- methods
			- createSquare, which has parameters i and j (which are the position on the board. This method creates a square object using the square class. The id is `${this.name}${10 * i + j}`. This method also fills in the up/down/left/right properties of the square, based on the idea that these will be created sequentially, i.e. i,j increasing from 0 to 9 each using for loops. For any square whose i value isn't 0, i.e. isn't on the first row, it adds the up object that has already been defined. It also sets itself as the down property of the square above it. left and right are similarly defined, except the condition that's needed to be checked is if j%10!==0, as those are squares along the left edge. Similarly, the upList/downList/... arrays are created. The upList is created by concatenating the square's own upList with the upList of the square above it. To create the downList, we use a forEach method on the upList of the square to push its own id to all of the objects in the upList. leftList and rightList are created similarly. Finally, createSquare adds this square object to the board's squares object using the square's id as its key.
			- buildBoard, which uses 2 for loops to go through 0 through 99, by having i go through 0 to 9 and j go through 0 to 9. For each pair of values, an object is created using the createSquare method. A div element called Moreover, a div element is created with id `${this.name}-board`. Each square is created using the square class whose object is added to the square property of the board. A div element for the square is created with id `${10 * i + j}` and appended to the board div. After the for loop ends, an event listener with type `'click'` and callback `(event) => this.squareClicker(event, this)`. Finally, the board element is appended as a child to the body.
			- squareClicker, which has two parameters, event and object. This method changes the style of the square to indicate if it's been selected, and if so, if it was a hit.
			- createShips, which has a constant shipsAndSizes, an array of arrays, each one has each ship's name and their length. Each ship is then created using the Ship class and added to the board's ships object using the name of the ship as its key.
			- buildAShip with parameter shipName, which creates a ship in the DOM (with the DOM?) as a collection of the length of the ship's boxes. 
			- shipyard, which 




Play [here!](https://pages.git.generalassemb.ly/adrianferenc/adrianferenc.github.io/)

Wireframes: [Game setup](https://wireframe.cc/1ksKgk) [Gameplay](https://wireframe.cc/ierRfK)