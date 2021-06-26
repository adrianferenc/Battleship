# Battleship

The game of Battleship was originally played with paper and pencil. It dates back to World War I, where there is some dispute as to whether it was created by the French or the Russians. Since, it has become a board game (Battleship, Milton Bradley 1967) and an electronic board game (Electronic Battleship, Milton Bradley 1977).

In 2012, the film Battleship (a movie I have not seen) came out, starring Taylor Kitsch, Alexander Skarsgård, Rihanna, Brooklyn Decker, Tadanobu Asano, and Liam Neeson. It has a 34% rating on Rotten Tomatoes. Some _fun_ facts about the film (via [IMDb](https://www.imdb.com)):

- The film utilized 600 extras.
- The film was originally set to be filmed off Australia's Gold Coast. Due to problems with government tax incentives, filming moved to Hawaii.
- Jeremy Renner was cast as Alex Hopper, but dropped out to co-star in The Master (2012), of which he also dropped out.
- The spectrum analyzer used to get the transmission through is an Anritsu MS2713E Spectrum Master.

## Screenshots of the game
<sub>Start Screen</sub>
<img width="1440" alt="start screen" src="https://user-images.githubusercontent.com/68762863/123341110-41788380-d502-11eb-9e43-228dceaa4de6.png">

<sub>Ships have been placed</sub>
<img width="1440" alt="placed ships" src="https://user-images.githubusercontent.com/68762863/123341159-58b77100-d502-11eb-8bbc-04b98c5868d2.png">

<sub>Mid-game gameplay</sub>
<img width="1440" alt="gameplay" src="https://user-images.githubusercontent.com/68762863/123341178-63720600-d502-11eb-9f50-bd4499237248.png">

<sub>Game over screen</sub>
<img width="1440" alt="game over" src="https://user-images.githubusercontent.com/68762863/123341212-708ef500-d502-11eb-83fb-46b8c0a4bf76.png">

## Technologies Used:

Battleship was created with HTML, CSS, and Javascript.

## Getting Started
The game can be played [here](https://adrianferenc.github.io/Battleship/).

- To start, click a ship to select it, then click a square on the board to place it. To rotate the ships, click rotate. Once all the ships are placed, press start to play.
- Once the game starts, click any square on the AI's board (the board on the right). A miss will show up as <span style="color:goldenrod"> goldenrod</span> and a hit shows up as <span style="color:red"> red</span>. When a ship is sunk, the entire ship shows up as <span style="color:navy"> navy</span>.

## How The Game Is Played:
In this game, you play battleship against an AI. The game works in 2 main stages. In the first stage, you place 5 ships onto the 10x10 grid. In the second stage, each player (you & AI) go back and forth picking squares on the grid where each believe their opponent has put a ship. When an entire ship is sunk, the other player is alerted. The game proceeds until one player's ships are all sunk, at which point the other player wins.




## Next Steps
- Fix a bug that occurs sometimes when the AI hits multiple ships without sinking any. Eventually the AI just keeps attacking the same square.
- Shows a "shadow" of a ship where your mouse is hovering when you're placing a ship so you know where it will go.
- Put outlines around the outside of the ships once placed on the board (using border-top-style, border-left-style, etc.)
- In stage 1, clicking on a ship that has already been placed will remove it from the board and put it back at the top of the shipyard.






