# Battleship

#How The Game Is Played:
In this game, you will play battleship against an AI. The game works in 2 main stages. The first stage is where the human player places their 5 ships onto their 10x10 grid. Then the second stage starts where each player (human player & AI) go back and forth picking squares on the grid where they believe their opponent has put a ship. When an entire ship is sunk, the other player is alerted. The game proceeds until one player's ships are all sunk, at which point the other player wins.

## A Brief History of Battleship:
The game of Battleship was originally a game played with paper and pencil. It dates back to World War I, where it is questionably disputed if it was created by the French or the Russions.

In 2012, the film Battleship (a movie I have not seen) came out, starring Taylor Kitsch, Alexander Skarsgård, Rihanna, Brooklyn Decker, Tadanobu Asano, and Liam Neeson. It has a 34% rating on Rotten Tomatoes' Tomatometer. Some fun facts about the film (via IMDb):

- The convenience store break-in at the beginning is a parody of a security video posted on YouTube, which went viral, of an actual liquor store break-in. Like the film, the robber climbed from the back of the store and fell down to the same spots from the ceiling twice. Both have the same camera angles and details, such as the foam and ceiling pieces falling down.
- The film utilized 600 extras.
- The film was originally set to be filmed off Australia's Gold Coast. Due to problems with government tax incentives, filming moved to Hawaii.
- Jeremy Renner was cast as Alex Hopper, but dropped out to co-star in The Master (2012), of which he also dropped out.
- The spectrum analyzer used to get the transmission through is an Anritsu MS2713E Spectrum Master.

## My Game

###Stage 1: Placing ships on your board.
- Features of this stage:
	- Player's board where the ships are placed. The board is made up of 100 squares, each with their own id and associated object which stores necessary information. The ship will have a position which is where the top of the ship will be, as well as a direction, which indicates where the rest of the ship goes. 
	- A "shipyard" with the ships that have not been placed yet and can be selected. By default the topmost ship is autoselected. When a ship is hovering over the board, the squares that would be occupied change color.
	- A button that rotates the currently selected ship. It changes the orientation property of the ship.
	- A button that undoes placing a ship and puts it back in the shipyard. It removes the position property of the ship and adds it back to the shipyard div.
	- A start button that only works once all the ships are placed. 

###Stage 2: Playing against AI
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


Play [here!](https://www.google.com/search?q=battleship)

Wireframes: [Game setup](https://wireframe.cc/1ksKgk) [Gameplay](https://wireframe.cc/ierRfK)


<!--###Future features
- codes! typing in ttt turns it into a tic tac toe game?-->