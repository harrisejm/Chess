import React from 'react';
import PropTypes from 'prop-types';

import bb from '../assets/img/BB.png';
import bk from '../assets/img/BK.png';
import bkn from '../assets/img/Bkn.png';
import bp from '../assets/img/BP.png';
import bq from '../assets/img/BQ.png';
import br from '../assets/img/BR.png';

import wb from '../assets/img/WB.png';
import wk from '../assets/img/WK.png';
import wkn from '../assets/img/WKn.png';
import wp from '../assets/img/WP.png';
import wq from '../assets/img/WQ.png';
import wr from '../assets/img/WR.png';



class MainBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: [],
      click: 0,
      moveFrom: [],
      whiteKingMove: false, //for castling
      blackKingMove: false, //for castling
      whiteRookMoveOne: false, //for castling
      whiteRookMoveTwo: false, //for castling
      blackRookMoveOne: false, //for castling
      blackRookMoveTwo: false, //for castling
      //////
      whiteKingPos: [7,4],
      blackKingPos: [0,4],
      check: null,
    };
    this.populateBoard = this.populateBoard.bind(this);
    this.testRender = this.testRender.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.movePawn = this.movePawn.bind(this);
    this.moveKight = this.moveKight.bind(this);
    this.moveRook = this.moveRook.bind(this);
    this.moveBishop = this.moveBishop.bind(this);
    this.moveQueen = this.moveQueen.bind(this);
    this.moveKing = this.moveKing.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
  }



  inCheck(pos) {
    if (this.state.click === 1) {
      //black pawn
      if (this.state.whiteKingPos[0]-1 === pos[0]
      && (this.state.whiteKingPos[1]-1 === pos[1] || this.state.whiteKingPos[1]+1 === pos[1])
      && (this.state.board[this.state.whiteKingPos[0]-1][this.state.whiteKingPos[1]-1].occupied === bp || this.state.board[this.state.whiteKingPos[0]-1][this.state.whiteKingPos[1]+1].occupied === bp)) {
        this.setState({check: " White king is in Check" });
        //white pawn
      } else if (this.state.blackKingPos[0]+1 === pos[0] && (this.state.blackKingPos[1]-1 === pos[1] || this.state.blackKingPos[1]+1 === pos[1]) && (this.state.board[this.state.blackKingPos[0]+1][this.state.blackKingPos[1]-1].occupied === wp || this.state.board[this.state.blackKingPos[0]+1][this.state.blackKingPos[1]+1].occupied === wp)) {
        this.setState({check: " Black king is in Check" });
      //  white Kight
      }
      else if (
           (this.state.whiteKingPos[0]-2 === pos[0] && this.state.whiteKingPos[1]-1 === pos[1])
        || (this.state.whiteKingPos[0]-2 === pos[0] && this.state.whiteKingPos[1]+1 === pos[1])
        || (this.state.whiteKingPos[0]-1 === pos[0] && this.state.whiteKingPos[1]-2 === pos[1])
        || (this.state.whiteKingPos[0]-1 === pos[0] && this.state.whiteKingPos[1]+2 === pos[1])
        || (this.state.whiteKingPos[0]+1 === pos[0] && this.state.whiteKingPos[1]-2 === pos[1])
        || (this.state.whiteKingPos[0]+1 === pos[0] && this.state.whiteKingPos[1]+2 === pos[1])
        || (this.state.whiteKingPos[0]+2 === pos[0] && this.state.whiteKingPos[1]-1 === pos[1])
        || (this.state.whiteKingPos[0]+2 === pos[0] && this.state.whiteKingPos[1]+1 === pos[1])

      ){
        this.setState({check: " White king is in Check" });
        //black knight
      } else if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied === wk &&
           (this.state.blackKingPos[0]-2 === pos[0] && this.state.blackKingPos[1]-1 === pos[1])
        || (this.state.blackKingPos[0]-2 === pos[0] && this.state.blackKingPos[1]+1 === pos[1])
        || (this.state.blackKingPos[0]-1 === pos[0] && this.state.blackKingPos[1]-2 === pos[1])
        || (this.state.blackKingPos[0]-1 === pos[0] && this.state.blackKingPos[1]+2 === pos[1])
        || (this.state.blackKingPos[0]+1 === pos[0] && this.state.blackKingPos[1]-2 === pos[1])
        || (this.state.blackKingPos[0]+1 === pos[0] && this.state.blackKingPos[1]+2 === pos[1])
        || (this.state.blackKingPos[0]+2 === pos[0] && this.state.blackKingPos[1]-1 === pos[1])
        || (this.state.blackKingPos[0]+2 === pos[0] && this.state.blackKingPos[1]+1 === pos[1])
      ) {
        this.setState({check: " Black king is in Check" });
      } else {
        this.setState({check: null});
      }

    }
  }
  updateBoard(pos) {
    //this.inCheck();
    let newBoard = this.state.board.slice();
    newBoard[pos[0]][pos[1]].occupied = newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied;
    newBoard[pos[0]][pos[1]].color = newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color;
    newBoard[pos[0]][pos[1]].piece = newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].piece;
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied = null;
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color = null;
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].highlight = null;
    if (newBoard[pos[0]][pos[1]].firstMove === true) {
      newBoard[pos[0]][pos[1]].firstMove = false;
    }
    this.setState({board: newBoard, click: 0});
  }
  ///Add piece detection. First move can jump a piece.


  movePawn(pos) {
    console.log('Pawn');
    let newBoard = this.state.board.slice();

    if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white' && pos[0] === this.state.moveFrom[0]-1 && pos[1] === this.state.moveFrom[1] && this.state.board[pos[0]][pos[1]].color !== 'black') {
      this.updateBoard(pos);
    } else if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black' && pos[0] === this.state.moveFrom[0]+1 && pos[1] === this.state.moveFrom[1] && this.state.board[pos[0]][pos[1]].color !== 'white') {

      this.updateBoard(pos);
      //first move. two spaces up
    } else if (this.state.moveFrom[0] === 6 && this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white' && pos[0] === this.state.moveFrom[0]-2 && pos[1] === this.state.moveFrom[1] && this.state.board[this.state.moveFrom[0]-1][this.state.moveFrom[1]].occupied === null && this.state.board[pos[0]][pos[1]].color !== 'black') {
      this.updateBoard(pos);
    } else if (this.state.moveFrom[0] === 1 && this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black' && pos[0] === this.state.moveFrom[0]+2 && pos[1] === this.state.moveFrom[1] && this.state.board[this.state.moveFrom[0]+1][this.state.moveFrom[1]].occupied === null && this.state.board[pos[0]][pos[1]].color !== 'white') {
      this.updateBoard(pos);
      //piece detection.  can't take a piece moving forward
    } else if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white'
    && this.state.board[pos[0]][pos[1]].color === 'black' && ((this.state.moveFrom[0]-1 === pos[0] && this.state.moveFrom[1]-1 === pos[1])
    || (this.state.moveFrom[0]-1 === pos[0] && this.state.moveFrom[1]+1 === pos[1]))) {
      this.updateBoard(pos);
    } else if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black'
    && this.state.board[pos[0]][pos[1]].color === 'white' && ((this.state.moveFrom[0]+1 === pos[0] && this.state.moveFrom[1]-1 === pos[1])
    || (this.state.moveFrom[0]+1 === pos[0] && this.state.moveFrom[1]+1 === pos[1]))) {
      this.updateBoard(pos);
    }
  }
  moveKight(pos) {
    console.log('knight');
    let newBoard = this.state.board.slice();
    if ((pos[0] === this.state.moveFrom[0]-2 && pos[1]+1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-2 && pos[1]-1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-1 && pos[1]-2 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-1 && pos[1]+2 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+1 && pos[1]-2 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+1 && pos[1]+2 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+2 && pos[1]-1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+2 && pos[1]+1 === this.state.moveFrom[1])) {

      this.updateBoard(pos);
    }
  }
  ///DONE

  moveRook(pos) {
    console.log('Rook');
    let newBoard = this.state.board.slice();
    if (pos[0] === this.state.moveFrom[0] || pos[1] === this.state.moveFrom[1]) {
      let pieceBlocking = 0;

      if (pos[0] - this.state.moveFrom[0] > 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (this.state.board[this.state.moveFrom[0]+i][pos[1]].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] < 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (this.state.board[this.state.moveFrom[0]-i][pos[1]].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[1] - this.state.moveFrom[1] > 0) {
        for (let i=1; i < Math.abs(pos[1]-this.state.moveFrom[1]); i++) {
          if (this.state.board[pos[0]][this.state.moveFrom[1]+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[1] - this.state.moveFrom[1] < 0) {
        for (let i=1; i < Math.abs(pos[1]-this.state.moveFrom[1]); i++) {
          if (this.state.board[pos[0]][this.state.moveFrom[1]-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      }
      console.log(pieceBlocking);
      if (pieceBlocking === 0) {
        this.updateBoard(pos);
        console.log('inner');
        console.log(pieceBlocking);
      } else {
        pieceBlocking = 0;
      }
      console.log('outer');
    }
  }

  moveBishop(pos) {
    console.log('Bishop');
    let newBoard = this.state.board.slice();
    let pieceBlocking = 0;
    if (pos[0] - this.state.moveFrom[0] === pos[1] - this.state.moveFrom[1]
      || pos[0] - this.state.moveFrom[0] === this.state.moveFrom[1]-pos[1]) {
        if (pos[0] - this.state.moveFrom[0] < 0 && pos[1] - this.state.moveFrom[1] < 0) {
          for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
            if (this.state.board[this.state.moveFrom[0]-i][this.state.moveFrom[1]-i].occupied !== null) {
              pieceBlocking += 1;
            }
          }
        } else if (pos[0] - this.state.moveFrom[0] < 0 && pos[1] - this.state.moveFrom[1] > 0) {
          for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
            if (this.state.board[this.state.moveFrom[0]-i][this.state.moveFrom[1]+i].occupied !== null) {
              pieceBlocking += 1;
            }
          }
        } else if (pos[0] - this.state.moveFrom[0] > 0 && pos[1] - this.state.moveFrom[1] < 0) {
          for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
            if (this.state.board[this.state.moveFrom[0]+i][this.state.moveFrom[1]-i].occupied !== null) {
              pieceBlocking += 1;
            }
          }
        } else if (pos[0] - this.state.moveFrom[0] > 0 && pos[1] - this.state.moveFrom[1] > 0) {
          for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
            if (this.state.board[this.state.moveFrom[0]+i][this.state.moveFrom[1]+i].occupied !== null) {
              pieceBlocking += 1;
            }
          }
        }
        if (pieceBlocking === 0) {
          this.updateBoard(pos);
          console.log('inner');
        } else {
          pieceBlocking = 0;
        }
      }
    }

    moveQueen(pos) {
      console.log('Queen');
      let newBoard = this.state.board.slice();
      let pieceBlocking = 0;
      if (pos[0] === this.state.moveFrom[0]
        || pos[1] === this.state.moveFrom[1]
        || pos[0] - this.state.moveFrom[0] === pos[1] - this.state.moveFrom[1]
        || pos[0] - this.state.moveFrom[0] === this.state.moveFrom[1]-pos[1]) {

          if (pos[0] - this.state.moveFrom[0] < 0 && pos[1] - this.state.moveFrom[1] < 0) {
            for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
              if (this.state.board[this.state.moveFrom[0]-i][this.state.moveFrom[1]-i].occupied !== null) {
                pieceBlocking += 1;
              }
            }
          } else if (pos[0] - this.state.moveFrom[0] < 0 && pos[1] - this.state.moveFrom[1] > 0) {
            for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
              if (this.state.board[this.state.moveFrom[0]-i][this.state.moveFrom[1]+i].occupied !== null) {
                pieceBlocking += 1;
              }
            }
          } else if (pos[0] - this.state.moveFrom[0] > 0 && pos[1] - this.state.moveFrom[1] < 0) {
            for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
              if (this.state.board[this.state.moveFrom[0]+i][this.state.moveFrom[1]-i].occupied !== null) {
                pieceBlocking += 1;
              }
            }
          } else if (pos[0] - this.state.moveFrom[0] > 0 && pos[1] - this.state.moveFrom[1] > 0) {
            for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
              if (this.state.board[this.state.moveFrom[0]+i][this.state.moveFrom[1]+i].occupied !== null) {
                pieceBlocking += 1;
              }
            }
          } else if (pos[0] - this.state.moveFrom[0] > 0) {
            for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
              if (this.state.board[this.state.moveFrom[0]+i][pos[1]].occupied !== null) {
                pieceBlocking += 1;
              }
            }
          } else if (pos[0] - this.state.moveFrom[0] < 0) {
            for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
              if (this.state.board[this.state.moveFrom[0]-i][pos[1]].occupied !== null) {
                pieceBlocking += 1;
              }
            }
          } else if (pos[1] - this.state.moveFrom[1] > 0) {
            for (let i=1; i < Math.abs(pos[1]-this.state.moveFrom[1]); i++) {
              if (this.state.board[pos[0]][this.state.moveFrom[1]+i].occupied !== null) {
                pieceBlocking += 1;
              }
            }
          } else if (pos[1] - this.state.moveFrom[1] < 0) {
            for (let i=1; i < Math.abs(pos[1]-this.state.moveFrom[1]); i++) {
              if (this.state.board[pos[0]][this.state.moveFrom[1]-i].occupied !== null) {
                pieceBlocking += 1;
              }
            }
          }
          if (pieceBlocking === 0) {
            this.updateBoard(pos);
            console.log('inner');
          } else {
            pieceBlocking = 0;
          }
        }
      }

      moveKing(pos) {
        console.log('King');
        let newBoard = this.state.board.slice();
        if ((pos[0] === this.state.moveFrom[0]+1 && pos[1]-1 === this.state.moveFrom[1])
        || (pos[0] === this.state.moveFrom[0]+1 && pos[1] === this.state.moveFrom[1])
        || (pos[0] === this.state.moveFrom[0]+1 && pos[1]+1 === this.state.moveFrom[1])

        || (pos[0] === this.state.moveFrom[0] && pos[1]-1 === this.state.moveFrom[1])
        || (pos[0] === this.state.moveFrom[0] && pos[1]+1 === this.state.moveFrom[1])

        || (pos[0] === this.state.moveFrom[0]-1 && pos[1]-1 === this.state.moveFrom[1])
        || (pos[0] === this.state.moveFrom[0]-1 && pos[1] === this.state.moveFrom[1])
        || (pos[0] === this.state.moveFrom[0]-1 && pos[1]+1 === this.state.moveFrom[1])) {
          if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white') {
            this.setState({whiteKingMove: true, whiteKingPos: pos});
          } else if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black') {
            this.setState({blackKingMove: true, blackKingPos: pos});
          }
          this.updateBoard(pos);
        }
        else if (this.state.whiteKingMove === false && pos[0] === this.state.moveFrom[0]
          && pos[1]-2 === this.state.moveFrom[1]
          && this.state.board[pos[0]][pos[1]-1].occupied === null
          && this.state.board[7][7].firstMove === true && this.state.board[pos[0]][pos[1]-2].color === 'white') {

            newBoard[7][5].occupied = newBoard[7][7].occupied;
            newBoard[7][5].color = newBoard[7][7].color;
            newBoard[7][5].piece = newBoard[7][7].piece;
            newBoard[7][7].occupied = null;
            newBoard[7][7].color = null;
            newBoard[7][7].highlight = null;
            if (newBoard[7][7].firstMove === true) {
              newBoard[7][5].firstMove = false;
            }
            this.setState({whiteKingMove: true, whiteKingPos: pos});
            this.updateBoard(pos);
          } else if (this.state.whiteKingMove === false && pos[0] === this.state.moveFrom[0]
            && pos[1]+2 === this.state.moveFrom[1]
            && this.state.board[pos[0]][pos[1]+1].occupied === null
            && this.state.board[7][0].firstMove === true && this.state.board[pos[0]][pos[1]-2].color === 'white') {

              newBoard[7][3].occupied = newBoard[7][0].occupied;
              newBoard[7][3].color = newBoard[7][0].color;
              newBoard[7][3].piece = newBoard[7][0].piece;
              newBoard[7][0].occupied = null;
              newBoard[7][0].color = null;
              newBoard[7][0].highlight = null;
              if (newBoard[7][0].firstMove === true) {
                newBoard[7][3].firstMove = false;
              }

              this.setState({whiteKingMove: true, whiteKingPos: pos});
              this.updateBoard(pos);
            }
            //// black
            else if (this.state.blackKingMove === false && pos[0] === this.state.moveFrom[0]
              && pos[1]-2 === this.state.moveFrom[1]
              && this.state.board[pos[0]][pos[1]-1].occupied === null
              && this.state.board[0][7].firstMove === true && this.state.board[pos[0]][pos[1]-2].color === 'black') {

                newBoard[0][5].occupied = newBoard[0][7].occupied;
                newBoard[0][5].color = newBoard[0][7].color;
                newBoard[0][5].piece = newBoard[0][7].piece;
                newBoard[0][7].occupied = null;
                newBoard[0][7].color = null;
                newBoard[0][7].highlight = null;
                if (newBoard[0][7].firstMove === true) {
                  newBoard[0][5].firstMove = false;
                }
                this.setState({blackKingMove: true, blackKingPos: pos});;
                this.updateBoard(pos);
              } else if (this.state.blackKingMove === false && pos[0] === this.state.moveFrom[0]
                && this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied === bk
                && pos[1]+2 === this.state.moveFrom[1]
                && this.state.board[pos[0]][pos[1]-1].occupied === null
                && this.state.board[pos[0]][pos[1]+1].occupied === null
                && this.state.board[0][0].firstMove === true && this.state.board[pos[0]][pos[1]+2].color === 'black') {

                  newBoard[0][3].occupied = newBoard[0][0].occupied;
                  newBoard[0][3].color = newBoard[0][0].color;
                  newBoard[0][3].piece = newBoard[0][0].piece;
                  newBoard[0][0].occupied = null;
                  newBoard[0][0].color = null;
                  newBoard[0][0].highlight = null;
                  if (newBoard[0][0].firstMove === true) {
                    newBoard[0][3].firstMove = false;
                  }

                  this.setState({blackKingMove: true, blackKingPos: pos});
                  this.updateBoard(pos);
                }
              }



              populateBoard() {
                let newBoard = this.state.board.slice();
                let objectArr = [];
                //  let pos;
                for (let i = 0; i < 8; i++) {
                  for (let a = 0; a < 8; a++) {
                    //  let position = i.toString() + a.toString();
                    if (i === 1) {
                      let test1 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bp, piece: this.movePawn}, {});
                      objectArr.push(test1);
                    } else if (i === 6) {
                      let test1 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wp, piece: this.movePawn}, {});
                      objectArr.push(test1);

                    } else if ((i === 0 && a === 0) || (i === 0 && a === 7)) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: br, piece: this.moveRook}, {});
                      objectArr.push(test2);
                    } else if ((i === 7 && a === 0) || (i === 7 && a === 7)) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wr, piece: this.moveRook}, {});
                      objectArr.push(test2);

                    } else if ((i === 0 && a === 1) || (i === 0 && a === 6)) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bkn, piece: this.moveKight}, {});
                      objectArr.push(test2);
                    } else if ((i === 7 && a === 1) || (i === 7 && a === 6)) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wkn, piece: this.moveKight}, {});
                      objectArr.push(test2);

                    } else if ((i === 0 && a === 2) || (i === 0 && a === 5)) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bb, piece: this.moveBishop}, {});
                      objectArr.push(test2);
                    } else if ((i === 7 && a === 2) || (i === 7 && a === 5)) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wb, piece: this.moveBishop}, {});
                      objectArr.push(test2);

                    } else if (i === 0 && a === 3) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bq, piece: this.moveQueen}, {});
                      objectArr.push(test2);
                    } else if (i === 7 && a === 3) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wq, piece: this.moveQueen}, {});
                      objectArr.push(test2);

                    } else if (i === 0 && a === 4) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bk, piece: this.moveKing}, {});
                      objectArr.push(test2);
                    } else if (i === 7 && a === 4) {
                      let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wk, piece: this.moveKing}, {});
                      objectArr.push(test2);

                    } else {
                      let test2 = Object.assign({positionY: i, positionX: a, color: null, highlight: null, firstMove: true, occupied: null, piece: null}, {});
                      objectArr.push(test2);
                    }
                    if (a === 7) {
                      newBoard.push(objectArr);
                      objectArr = [];
                    }
                  }
                }
                this.setState({board: newBoard});
                console.log(this.state.board.length);
              }

              componentWillMount(){
                this.populateBoard();
              }

              movePiece(pos){
                let newBoard = this.state.board.slice();
                /////////////
                //  this.inCheck(pos); //////////////////////////////////////
                /////////////
                if (this.state.click === 0) {

                  if (this.state.board[pos[0]][pos[1]].occupied !== null) {
                    let newBoard = this.state.board.slice();
                    newBoard[pos[0]][pos[1]].highlight = Object.assign({border: 'solid', borderWidth: 'thick', borderColor: 'green'}, {});

                    //   this.setState({click: 1});
                    this.setState({moveFrom: [pos[0],pos[1]], click: 1});
                  }
                }
                if (this.state.moveFrom.length !== 0 && this.state.click === 1) {

                  if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color !== this.state.board[pos[0]][pos[1]].color) {

                    this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].piece(pos);

                    console.log(newBoard);
                    //   this.setState({board: newBoard, click: 0})
                  } else {

                    newBoard[pos[0]][pos[1]].highlight = Object.assign({border: 'solid',borderWidth: 'thick',borderColor: 'green'}, {});
                    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].highlight = null;

                    this.setState({moveFrom: [pos[0],pos[1]]});
                    this.setState({board: newBoard});

                  }
                }
                //    this.setState({board: newBoard})
                console.log(this.state.board);
                this.inCheck(pos);
              }

              testRender(){
                const squareColor = {
                  backgroundColor: '#ADD8E6'
                };

                const showCheck = {
                  fontSize: '30px',
                  color: 'red'
                }

                //  const row1 = <td> {this.state.board[0][0].occupied} </td>;
                //  const row2 = <td> {this.state.board[3][0].occupied} </td>;
                // let grid = [];
                // for (let q = 0; q < 8; q++) {
                //   for (let z = 0; z < 8; z++) {
                //     grid.push(React.createElement('td', {className: 'hello'}, this.state.board[q][z].occupied))
                //   }
                // }
                //let greeting = React.createElement('td', {}, this.state.board[3][0].occupied);

                const chessBoard =
                <div>
                  <style jsx>{`
                      td {
                        border-style: solid;
                        width: 70px;
                        height: 70px;
                      }
                      `}</style>

                    <p>Move From: []</p>
                    <p>Move To: </p>


                    <img src={bb}/>
                    <img src={bk}/>
                    <img src={bkn}/>
                    <img src={bp}/>
                    <img src={bq}/>
                    <img src={br}/>

                    <img src={wb}/>
                    <img src={wk}/>
                    <img src={wkn}/>
                    <img src={wp}/>
                    <img src={wq}/>
                    <img src={wr}/>
                    <p>{this.state.click} Does this work</p>
                    <p>White King: {this.state.whiteKingPos[0]} - {this.state.whiteKingPos[1]}</p>
                    <p>Black King: {this.state.blackKingPos[0]} - {this.state.blackKingPos[1]}</p>
                    <p>Click: {this.state.click}</p>

                    <p style={showCheck}> In Check {this.state.check}</p>
                    <table>
                      <tbody>
                        <tr className="row1">

                          <td style={this.state.board[0][0].highlight} onClick={()=>this.movePiece([0,0])}><img src={this.state.board[0][0].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[0][1].highlight)} onClick={()=>this.movePiece([0,1])}><img src={this.state.board[0][1].occupied}/></td>
                          <td style={this.state.board[0][2].highlight} onClick={()=>this.movePiece([0,2])}><img src={this.state.board[0][2].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[0][3].highlight)} onClick={()=>this.movePiece([0,3])}><img src={this.state.board[0][3].occupied}/></td>
                          <td style={this.state.board[0][4].highlight} onClick={()=>this.movePiece([0,4])}><img src={this.state.board[0][4].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[0][5].highlight)} onClick={()=>this.movePiece([0,5])}><img src={this.state.board[0][5].occupied}/></td>
                          <td style={this.state.board[0][6].highlight} onClick={()=>this.movePiece([0,6])}><img src={this.state.board[0][6].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[0][7].highlight)} onClick={()=>this.movePiece([0,7])}><img src={this.state.board[0][7].occupied}/></td>
                        </tr>
                        <tr className="row2">
                          <td style={Object.assign({}, squareColor, this.state.board[1][0].highlight)} onClick={()=>this.movePiece([1,0])}><img src={this.state.board[1][0].occupied}/></td>
                          <td style={this.state.board[1][1].highlight} onClick={()=>this.movePiece([1,1])}><img src={this.state.board[1][1].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[1][2].highlight)} onClick={()=>this.movePiece([1,2])}><img src={this.state.board[1][2].occupied}/></td>
                          <td style={this.state.board[1][3].highlight} onClick={()=>this.movePiece([1,3])}><img src={this.state.board[1][3].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[1][4].highlight)} onClick={()=>this.movePiece([1,4])}><img src={this.state.board[1][4].occupied}/></td>
                          <td style={this.state.board[1][5].highlight} onClick={()=>this.movePiece([1,5])}><img src={this.state.board[1][5].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[1][6].highlight)} onClick={()=>this.movePiece([1,6])}><img src={this.state.board[1][6].occupied}/></td>
                          <td style={this.state.board[1][7].highlight} onClick={()=>this.movePiece([1,7])}><img src={this.state.board[1][7].occupied}/></td>
                        </tr>
                        <tr className="row3">
                          <td style={this.state.board[2][0].highlight} onClick={()=>this.movePiece([2,0])}><img src={this.state.board[2][0].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[2][1].highlight)} onClick={()=>this.movePiece([2,1])}><img src={this.state.board[2][1].occupied}/></td>
                          <td style={this.state.board[2][2].highlight} onClick={()=>this.movePiece([2,2])}><img src={this.state.board[2][2].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[2][3].highlight)} onClick={()=>this.movePiece([2,3])}><img src={this.state.board[2][3].occupied}/></td>
                          <td style={this.state.board[2][4].highlight} onClick={()=>this.movePiece([2,4])}><img src={this.state.board[2][4].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[2][5].highlight)} onClick={()=>this.movePiece([2,5])}><img src={this.state.board[2][5].occupied}/></td>
                          <td style={this.state.board[2][6].highlight} onClick={()=>this.movePiece([2,6])}><img src={this.state.board[2][6].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[2][7].highlight)} onClick={()=>this.movePiece([2,7])}><img src={this.state.board[2][7].occupied}/></td>
                        </tr>
                        <tr className="row4">
                          <td style={Object.assign({}, squareColor, this.state.board[3][0].highlight)} onClick={()=>this.movePiece([3,0])}><img src={this.state.board[3][0].occupied}/></td>
                          <td style={this.state.board[3][1].highlight} onClick={()=>this.movePiece([3,1])}><img src={this.state.board[3][1].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[3][2].highlight)} onClick={()=>this.movePiece([3,2])}><img src={this.state.board[3][2].occupied}/></td>
                          <td style={this.state.board[3][3].highlight} onClick={()=>this.movePiece([3,3])}><img src={this.state.board[3][3].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[3][4].highlight)} onClick={()=>this.movePiece([3,4])}><img src={this.state.board[3][4].occupied}/></td>
                          <td style={this.state.board[3][5].highlight} onClick={()=>this.movePiece([3,5])}><img src={this.state.board[3][5].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[3][6].highlight)} onClick={()=>this.movePiece([3,6])}><img src={this.state.board[3][6].occupied}/></td>
                          <td style={this.state.board[3][7].highlight} onClick={()=>this.movePiece([3,7])}><img src={this.state.board[3][7].occupied}/></td>
                        </tr>
                        <tr className="row5">
                          <td style={this.state.board[4][0].highlight} onClick={()=>this.movePiece([4,0])}><img src={this.state.board[4][0].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[4][1].highlight)} onClick={()=>this.movePiece([4,1])}><img src={this.state.board[4][1].occupied}/></td>
                          <td style={this.state.board[4][2].highlight} onClick={()=>this.movePiece([4,2])}><img src={this.state.board[4][2].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[4][3].highlight)} onClick={()=>this.movePiece([4,3])}><img src={this.state.board[4][3].occupied}/></td>
                          <td style={this.state.board[4][4].highlight} onClick={()=>this.movePiece([4,4])}><img src={this.state.board[4][4].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[4][5].highlight)} onClick={()=>this.movePiece([4,5])}><img src={this.state.board[4][5].occupied}/></td>
                          <td style={this.state.board[4][6].highlight} onClick={()=>this.movePiece([4,6])}><img src={this.state.board[4][6].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[4][7].highlight)} onClick={()=>this.movePiece([4,7])}><img src={this.state.board[4][7].occupied}/></td>
                        </tr>
                        <tr className="row6">
                          <td style={Object.assign({}, squareColor, this.state.board[5][0].highlight)} onClick={()=>this.movePiece([5,0])}><img src={this.state.board[5][0].occupied}/></td>
                          <td style={this.state.board[5][1].highlight} onClick={()=>this.movePiece([5,1])}><img src={this.state.board[5][1].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[5][2].highlight)} onClick={()=>this.movePiece([5,2])}><img src={this.state.board[5][2].occupied}/></td>
                          <td style={this.state.board[5][3].highlight} onClick={()=>this.movePiece([5,3])}><img src={this.state.board[5][3].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[5][4].highlight)} onClick={()=>this.movePiece([5,4])}><img src={this.state.board[5][4].occupied}/></td>
                          <td style={this.state.board[5][5].highlight} onClick={()=>this.movePiece([5,5])}><img src={this.state.board[5][5].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[5][6].highlight)} onClick={()=>this.movePiece([5,6])}><img src={this.state.board[5][6].occupied}/></td>
                          <td style={this.state.board[5][7].highlight} onClick={()=>this.movePiece([5,7])}><img src={this.state.board[5][7].occupied}/></td>
                        </tr>
                        <tr className="row7">
                          <td style={this.state.board[6][0].highlight} onClick={()=>this.movePiece([6,0])}><img src={this.state.board[6][0].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[6][1].highlight)} onClick={()=>this.movePiece([6,1])}><img src={this.state.board[6][1].occupied}/></td>
                          <td style={this.state.board[6][2].highlight} onClick={()=>this.movePiece([6,2])}><img src={this.state.board[6][2].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[6][3].highlight)} onClick={()=>this.movePiece([6,3])}><img src={this.state.board[6][3].occupied}/></td>
                          <td style={this.state.board[6][4].highlight} onClick={()=>this.movePiece([6,4])}><img src={this.state.board[6][4].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[6][5].highlight)} onClick={()=>this.movePiece([6,5])}><img src={this.state.board[6][5].occupied}/></td>
                          <td style={this.state.board[6][6].highlight} onClick={()=>this.movePiece([6,6])}><img src={this.state.board[6][6].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[6][7].highlight)} onClick={()=>this.movePiece([6,7])}><img src={this.state.board[6][7].occupied}/></td>
                        </tr>
                        <tr className="row8">
                          <td style={Object.assign({}, squareColor, this.state.board[7][0].highlight)} onClick={()=>this.movePiece([7,0])}><img src={this.state.board[7][0].occupied}/></td>
                          <td style={this.state.board[7][1].highlight} onClick={()=>this.movePiece([7,1])}><img src={this.state.board[7][1].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[7][2].highlight)} onClick={()=>this.movePiece([7,2])}><img src={this.state.board[7][2].occupied}/></td>
                          <td style={this.state.board[7][3].highlight} onClick={()=>this.movePiece([7,3])}><img src={this.state.board[7][3].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[7][4].highlight)} onClick={()=>this.movePiece([7,4])}><img src={this.state.board[7][4].occupied}/></td>
                          <td style={this.state.board[7][5].highlight} onClick={()=>this.movePiece([7,5])}><img src={this.state.board[7][5].occupied}/></td>
                          <td style={Object.assign({}, squareColor, this.state.board[7][6].highlight)} onClick={()=>this.movePiece([7,6])}><img src={this.state.board[7][6].occupied}/></td>
                          <td style={this.state.board[7][7].highlight} onClick={()=>this.movePiece([7,7])}><img src={this.state.board[7][7].occupied}/></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>;
                  return chessBoard;
                }

                render(){
                  return (
                    <div>
                      <p>dsgfdghghghfg</p>
                      {this.testRender()}
                      <p onClick={this.populateBoard}>Push</p>
                    </div>
                  );
                }
              }
              // App.propTypes = {
              //   populateBoard: PropTypes.func
              // };

              export default MainBoard;
