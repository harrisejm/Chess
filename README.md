# Chess App

#### By Eddie Harris

Live site: https://chess-eddie-harris.firebaseapp.com

## Project Description

Chess created in React

Features:
- All pieces can only make legal moves.
- All pieces can take an opponent's piece if the move is a legal move.
- Both Kings can castle to the right or left. Can only castle if it is a legal move (i.e not in check).
- If a pawn reaches the opponent's back rank, a modal will open and prompt the player to select a bishop, knight, rook or queen to switch out with the pawn.
- Determines when a player is in check.
- Players are prevented from moving into check, can only make legal moves.
- If a player is in check, the next move must result in taking them out of check.
- Determines when a player is in checkmate.
  - Assess if a player can take the checking piece, block the checking piece, or move the king directly out of check. If all three condition are not met, the player is in checkmate.
- Determines when the game has ended in a stalemate.
  - Assess if there are any legal moves available while the king in NOT in check.

## Technologies Used
- JavaScript
- HTML
- CSS
- bootstrap
- React
- firebase

## Setup

* Clone this repository
* Save to Desktop
* While in the root directory, enter into the terminal "npm install"
* After the installation is complete, enter into the terminal "npm run start", then navigate to http://localhost:8080/.
