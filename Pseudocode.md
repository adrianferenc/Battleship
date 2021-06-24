# Pseudocode:

- Stage 1
	- Set up a board for the player and the ships that can be placed on it.
	- Clicking a ship and then a square on the board places the ship on the board.
	- Once all the ships are placed, the start button is enabled and can be clicked, which leads to stage 2.

- Stage 2
	- Player and AI take turns guessing where their ships are.
	- When a player clicks, it shows as a hit or a miss by the color the square changes to.
	- The same happens with the AI.
	- The AI's strategy is to pick the most available spot based on available spots to the left, right, up, and down. Once it hits something, it searches adjacent spots until it hits again and then continues in that direction until it misses. It then goes back to the spot where it first hit and searches other adjacent squares. 
	- If a ship is sunk, its color turns a dark blue.
	- After each move, the move is written in the game update section. 
	- Once a player wins, the game indicates which player has won, how many games each player has won, and offers to play a new game.






Wireframes: [Game setup](https://wireframe.cc/1ksKgk) [Gameplay](https://wireframe.cc/ierRfK)