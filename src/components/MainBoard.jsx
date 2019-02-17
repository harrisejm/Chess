import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import PiecesTaken from './PiecesTaken';
import PiecesToSelect from './PiecesToSelect';
import ChessBoard from './ChessBoard';

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
      board: [
        // [[],[],[],[],[],[],[],[]],
        // [[],[],[],[],[],[],[],[]],
        // [[],[],[],[],[],[],[],[]],
        // [[],[],[],[],[],[],[],[]],
        // [[],[],[],[],[],[],[],[]],
        // [[],[],[],[],[],[],[],[]],
        // [[],[],[],[],[],[],[],[]],
        // [[],[],[],[],[],[],[],[]]
      ],
      takenPiecesWhite: [],
      takenPiecesBlack: [],
      selectPieceWhite: [],
      selectPieceBlack: [],
      click: 0,
      moveFrom: [],
      switchPawn: [],
      whiteKingMove: false, //for castling
      blackKingMove: false, //for castling
      whiteRookMoveOne: false, //for castling
      whiteRookMoveTwo: false, //for castling
      blackRookMoveOne: false, //for castling
      blackRookMoveTwo: false, //for castling
      //////
      whiteKingPos: [7,4],
      blackKingPos: [0,4],
      test: "hello",

      blockCheckmateRook: "false",
      rookQueenPosition: [],

      check: null,
      showPieceSelectionModal: false,
      rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []},

      //  bishopQueenPositions: {topLeft: false, topRight: false, bottomLeft: false, bottomRight: false, distanceTopRight: [], distanceTopLeft: [], distanceBottomLeft: [], distanceBottomRight: [], positionTop: [], positionBottom: [], positionLeft: [], positionRight: []}
    };
    this.populateBoard = this.populateBoard.bind(this);
    //  this.renderBoard = this.renderBoard.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.movePawn = this.movePawn.bind(this);
    this.moveKight = this.moveKight.bind(this);
    this.moveRook = this.moveRook.bind(this);
    this.moveBishop = this.moveBishop.bind(this);
    this.moveQueen = this.moveQueen.bind(this);
    this.moveKing = this.moveKing.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.checkByRook = this.checkByRook.bind(this);
    this.selectTakenPiece = this.selectTakenPiece.bind(this);
    //  this.checkmatePawn = this.this.checkmatePawn.bind(this);
  }

  checkByRook(pos,color,isKing,piecesPos1,piecePos2,arr,checkingPiece){

    let newRookPositions = {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: [], positionTop: [], positionBottom: [], positionLeft: [], positionRight: []};

    let kingPieceColor;
    let rookPieceColor;
    let queenPieceColor;
    let colorOfKing;
    let kingPosY;
    let kingPosX;
    let runCheckmateTest = false;

    if (color === 1) {
      kingPieceColor = wk;
      rookPieceColor = br;
      queenPieceColor = bq;
      colorOfKing = " White";
      kingPosY = piecesPos1;
      kingPosX = piecePos2;
    } else if (color === 2) {
      kingPieceColor = bk;
      rookPieceColor = wr;
      queenPieceColor = wq;
      colorOfKing = " Black";
      kingPosY = piecesPos1;
      kingPosX = piecePos2;
    }
    let rookUp = false, rookDown = false, rookLeft = false, rookRight = false;
    let distanceToKingUp = [], distanceToKingDown = [], distanceToKingLeft = [], distanceToKingRight = [];
    ///////

    // let a=0,b=0,c=0,d=0;
    // let whiteKingArr = [this.state.board[this.state.whiteKingPos[0]+a][this.state.whiteKingPos[1]].occupied === br, this.state.board[this.state.whiteKingPos[0]-b][this.state.whiteKingPos[1]].occupied === br, this.state.board[this.state.whiteKingPos[0]][this.state.whiteKingPos[1]-c].occupied === br, this.state.board[this.state.whiteKingPos[0]][this.state.whiteKingPos[1]+d].occupied === br]
    //

    //allows king to move out of check
    if (this.state.board[pos[0]][pos[1]].occupied === kingPieceColor) {
      this.setState({check: null});
    } else {
      //rook up
      for (let i=1; i < kingPosY+1; i++) {
        if (this.state.board[kingPosY-i][kingPosX].occupied === rookPieceColor || this.state.board[kingPosY-i][kingPosX].occupied === queenPieceColor) {
          rookUp = true;
          distanceToKingUp.push(i);
          newRookPositions.distanceTop = distanceToKingUp;
          newRookPositions.positionTop.push([kingPosY-i,kingPosX]);
        }
      }
      //rook down
      for (let i=1; i < 8-kingPosY; i++) {
        if (this.state.board[kingPosY+i][kingPosX].occupied === rookPieceColor || this.state.board[kingPosY+i][kingPosX].occupied === queenPieceColor) {
          rookDown = true;
          distanceToKingDown.push(i);
          newRookPositions.distanceBottom = distanceToKingDown;
          newRookPositions.positionBottom.push([kingPosY+i,kingPosX]);
        }
      }
      //rook left
      for (let i=1; i < kingPosX+1; i++) {
        if (this.state.board[kingPosY][kingPosX-i].occupied === rookPieceColor || this.state.board[kingPosY][kingPosX-i].occupied === queenPieceColor) {
          rookLeft = true;
          distanceToKingLeft.push(i);
          newRookPositions.distanceLeft = distanceToKingLeft;
          newRookPositions.positionLeft.push([kingPosY,kingPosX-i]);
        }
      }
      //rook right
      for (let i=1; i < 8 - kingPosX; i++) {
        if (this.state.board[kingPosY][kingPosX+i].occupied === rookPieceColor || this.state.board[kingPosY][kingPosX+i].occupied === queenPieceColor) {
          rookRight = true;
          distanceToKingRight.push(i);
          newRookPositions.distanceRight = distanceToKingRight;
          newRookPositions.positionRight.push([kingPosY,kingPosX+i]);
        }
      }
      //////////////////
      //rook up
      if (rookUp === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceToKingUp[0]; i++) {
          if (this.state.board[kingPosY-i][kingPosX].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newRookPositions.top = true;
          if (isKing) {
            this.setState({check: colorOfKing + " king is in Check" });
            runCheckmateTest = true;
            checkingPiece[0] = kingPosX;
          } else {
            arr.push(true);
          }
        }
      }
      //rook down
      if (rookDown === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceToKingDown[0]; i++) {
          if (this.state.board[kingPosY+i][kingPosX].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newRookPositions.bottom = true;
          if (isKing) {
            this.setState({check: colorOfKing + " king is in Check" });
            runCheckmateTest = true;
            checkingPiece[1] = kingPosX;
          } else {
            arr.push(true);
          }
        }
      }
      //rook left
      if (rookLeft === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceToKingLeft[0]; i++) {
          if (this.state.board[kingPosY][kingPosX-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newRookPositions.left = true;
          if (isKing) {
            this.setState({check: colorOfKing + " king is in Check" });
            runCheckmateTest = true;
            checkingPiece[2] = kingPosY;
          } else {
            arr.push(true);
          }
        }
      }
      //rook right
      if (rookRight === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceToKingRight[0]; i++) {
          if (this.state.board[kingPosY][kingPosX+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newRookPositions.right = true;
          if (isKing === true) {
            this.setState({check: colorOfKing + " king is in Check RIGHT" });
            runCheckmateTest = true;
            checkingPiece[3] = kingPosY;
          } else {
            arr.push(true);
          }
        }
      }
    }
    if (isKing && runCheckmateTest) {
      this.checkmateRookQueen(pos,newRookPositions.top,newRookPositions.bottom,newRookPositions.left,newRookPositions.right,newRookPositions.distanceTop[0],newRookPositions.distanceBottom[0],newRookPositions.distanceLeft[0],newRookPositions.distanceRight[0],newRookPositions.positionTop[0],newRookPositions.positionBottom[0],newRookPositions.positionLeft[0],newRookPositions.positionRight[0],color,arr);
    }

    else {
      console.log(pos,newRookPositions.top,newRookPositions.bottom,newRookPositions.left,newRookPositions.right,newRookPositions.distanceTop[0],newRookPositions.distanceBottom[0],newRookPositions.distanceLeft[0],newRookPositions.distanceRight[0]);
    }
  }

  checkByBishop(pos,color,isKing,piecePos1,piecePos2,arr,checkingPiece) {
    let newBishopQueenPositions = {topLeft: false, topRight: false, bottomLeft: false, bottomRight: false, distanceTopLeft: [], distanceTopRight: [], distanceBottomLeft: [], distanceBottomRight: [], positionTopLeft: [], positionTopRight: [], positionBottomLeft: [], positionBottomRight: []};
    // if (isKing === 0) {
    //   alert("dsggshhh");
    // }
    let kingPieceColor;
    let bishopPieceColor;
    let queenPieceColor;
    let colorOfKing;
    let kingPosY;
    let kingPosX;
    let runCheckmateTest = false;

    if (color === 1) {
      kingPieceColor = wk;
      bishopPieceColor = bb;
      queenPieceColor = bq;
      colorOfKing = " White";
      kingPosY = piecePos1
      kingPosX = piecePos2
    } else if (color === 2) {
      kingPieceColor = bk;
      bishopPieceColor = wb;
      queenPieceColor = wq;
      colorOfKing = " Black";
      kingPosY = piecePos1;
      kingPosX = piecePos2;
    }
    let tl, tr, bl, br;
    let bishopTopLeft = false, bishopTopRight = false, bishopBottomLeft = false, bishopBottomRight = false;
    let distanceTopLeft = [], distanceTopRight = [], distanceBottomLeft = [], distanceBottomRight = [];

    //allows king to move out of check
    if (this.state.board[pos[0]][pos[1]].occupied === kingPieceColor) {
      this.setState({check: null});
    } else {
      //bishop Top left
      if (kingPosY >= kingPosX) {
        tl = kingPosX+1;
      } else {
        tl = kingPosY+1;
      }

      for (let i=1; i < tl; i++) {
        if (this.state.board[kingPosY-i][kingPosX-i].occupied === bishopPieceColor || this.state.board[kingPosY-i][kingPosX-i].occupied === queenPieceColor) {
          bishopTopLeft = true;
          distanceTopLeft.push(i);
          newBishopQueenPositions.distanceTopLeft = distanceTopLeft;
          newBishopQueenPositions.positionTopLeft.push([kingPosY-i,kingPosX-i]);
        }
      }
      //bishop top right
      if (kingPosY+1 >= 8-kingPosX) {
        tr = 8-kingPosX;
      } else {
        tr = kingPosY+1;
      }
      for (let i=1; i < tr; i++) {
        if (this.state.board[kingPosY-i][kingPosX+i].occupied === bishopPieceColor || this.state.board[kingPosY-i][kingPosX+i].occupied === queenPieceColor) {
          bishopTopRight = true;
          distanceTopRight.push(i);
          newBishopQueenPositions.distanceTopRight = distanceTopRight;
          newBishopQueenPositions.positionTopRight.push([kingPosY-i,kingPosX+i]);
        }
      }
      //bishop bottom left
      if (8-kingPosY >= kingPosX+1) {
        bl = kingPosX+1;
      } else {
        bl = 8-kingPosY;
      }
      for (let i=1; i < bl; i++) {
        if (this.state.board[kingPosY+i][kingPosX-i].occupied === bishopPieceColor || this.state.board[kingPosY+i][kingPosX-i].occupied === queenPieceColor) {
          bishopBottomLeft = true;
          distanceBottomLeft.push(i);
          newBishopQueenPositions.distanceBottomLeft = distanceBottomLeft;
          newBishopQueenPositions.positionBottomLeft.push([kingPosY+i,kingPosX-i]);
        }
      }
      //bishop bottom right
      if (8-kingPosY >= 8-kingPosX) {
        br = 8-kingPosX;
      } else {
        br = 8-kingPosY;
      }
      for (let i=1; i < br; i++) {
        if (this.state.board[kingPosY+i][kingPosX+i].occupied === bishopPieceColor || this.state.board[kingPosY+i][kingPosX+i].occupied === queenPieceColor) {
          bishopBottomRight = true;
          distanceBottomRight.push(i);
          newBishopQueenPositions.distanceBottomRight = distanceBottomRight;
          newBishopQueenPositions.positionBottomRight.push([kingPosY+i,kingPosX+i]);
        }
      }
      //////////////////
      //bishop top left
      if (bishopTopLeft === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceTopLeft[0]; i++) {
          if (this.state.board[kingPosY-i][kingPosX-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newBishopQueenPositions.topLeft = true;
          if (isKing) {
            this.setState({check: colorOfKing + " king is in Check TL" });
            runCheckmateTest = true;
            checkingPiece[0] = [kingPosY,kingPosX];
          } else {
            arr.push(true);
            //    alert("!!!isKing TL");
            //  this.setState({blockCheckmate: true});
          }
        }

      }
      //bishop top right
      if (bishopTopRight === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceTopRight[0]; i++) {
          if (this.state.board[kingPosY-i][kingPosX+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }

        if (pieceBlocking === 0) {
          newBishopQueenPositions.topRight = true;
          if (isKing) {
            this.setState({check: colorOfKing + " king is in Check TRr" });
            runCheckmateTest = true;
            checkingPiece[1] = [kingPosY,kingPosX];
          } else {
            arr.push(true);
            //      alert("!!!isKing TR");
          }
        }
      }
      //bishop bottom left
      if (bishopBottomLeft === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceBottomLeft[0]; i++) {
          if (this.state.board[kingPosY+i][kingPosX-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newBishopQueenPositions.bottomLeft = true;
          if (isKing) {
            this.setState({check: colorOfKing + " king is in Check BL" });
            runCheckmateTest = true;
            checkingPiece[2] = [kingPosY,kingPosX];
          } else {
            arr.push(true);
            //      alert("!!!isKing BL");
          }
        }
      }
      //bishop bottom right
      if (bishopBottomRight === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceBottomRight[0]; i++) {
          if (this.state.board[kingPosY+i][kingPosX+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newBishopQueenPositions.bottomRight = true;
          if (isKing) {
            this.setState({check: colorOfKing + " king is in Check BR" });
            runCheckmateTest = true;
            checkingPiece[3] = [kingPosY,kingPosX];
          } else {
            arr.push(true);
          }
        }
      }
    }
    if (isKing && runCheckmateTest) {
      this.checkmateBishopQueen(pos,newBishopQueenPositions.topLeft,newBishopQueenPositions.topRight,newBishopQueenPositions.bottomLeft,newBishopQueenPositions.bottomRight,newBishopQueenPositions.distanceTopLeft[0],newBishopQueenPositions.distanceTopRight[0],newBishopQueenPositions.distanceBottomLeft[0],newBishopQueenPositions.distanceBottomRight[0],newBishopQueenPositions.positionTopLeft[0],newBishopQueenPositions.positionTopRight[0],newBishopQueenPositions.positionBottomLeft[0],newBishopQueenPositions.positionBottomRight[0],color,arr);
    }
  }
  checkByKnight(pos,color,isKing,piecePos1,piecePos2,arr){
    let kingPieceColor;
    let knightPieceColor;
    let colorOfKing;
    let runCheckmateTest = false;

    if (color === 1) {
      kingPieceColor = wk;
      knightPieceColor = bkn;
      colorOfKing = " White";
    } else if (color === 2) {
      kingPieceColor = bk;
      knightPieceColor = wkn;
      colorOfKing = " Black";
    }
    if (isKing &&
      (piecePos1-2 === pos[0] && piecePos2-1 === pos[1] && this.state.board[piecePos1-2][piecePos2-1].occupied === knightPieceColor)
      || (piecePos1-2 === pos[0] && piecePos2+1 === pos[1] && this.state.board[piecePos1-2][piecePos2+1].occupied === knightPieceColor)
      || (piecePos1-1 === pos[0] && piecePos2-2 === pos[1] && this.state.board[piecePos1-1][piecePos2-2].occupied === knightPieceColor)
      || (piecePos1-1 === pos[0] && piecePos2+2 === pos[1] && this.state.board[piecePos1-1][piecePos2+2].occupied === knightPieceColor)
      || (piecePos1+1 === pos[0] && piecePos2-2 === pos[1] && this.state.board[piecePos1+1][piecePos2-2].occupied === knightPieceColor)
      || (piecePos1+1 === pos[0] && piecePos2+2 === pos[1] && this.state.board[piecePos1+1][piecePos2+2].occupied === knightPieceColor)
      || (piecePos1+2 === pos[0] && piecePos2-1 === pos[1] && this.state.board[piecePos1+2][piecePos2-1].occupied === knightPieceColor)
      || (piecePos1+2 === pos[0] && piecePos2+1 === pos[1] && this.state.board[piecePos1+2][piecePos2+1].occupied === knightPieceColor)
    ) {
      runCheckmateTest = true;
      this.setState({check: colorOfKing + " king is in Check" });
      //black knight
    }

    if (!isKing &&
      (piecePos1-2 >=0 && piecePos2-1 >=0 && this.state.board[piecePos1-2][piecePos2-1].occupied === knightPieceColor)
      || (piecePos1-2 >=0 && piecePos2+1 <=7 && this.state.board[piecePos1-2][piecePos2+1].occupied === knightPieceColor)
      || (piecePos1-1 >=0 && piecePos2-2 >=0 && this.state.board[piecePos1-1][piecePos2-2].occupied === knightPieceColor)
      || (piecePos1-1 >=0 && piecePos2+2 <=7 && this.state.board[piecePos1-1][piecePos2+2].occupied === knightPieceColor)
      || (piecePos1+1 <=7 && piecePos2-2 >=0 && this.state.board[piecePos1+1][piecePos2-2].occupied === knightPieceColor)
      || (piecePos1+1 <=7 && piecePos2+2 <=7 && this.state.board[piecePos1+1][piecePos2+2].occupied === knightPieceColor)
      || (piecePos1+2 <=7 && piecePos2-1 >=0 && this.state.board[piecePos1+2][piecePos2-1].occupied === knightPieceColor)
      || (piecePos1+2 <=7 && piecePos2+1 <=7 && this.state.board[piecePos1+2][piecePos2+1].occupied === knightPieceColor)
    ) {
      arr.push(true);
    }
  }
  checkByPawn(pos,color,isKing,whitePiecePos1,whitePiecePos2,blackPiecePos1,blackPiecePos2,arr){
    let blackPawnPositionOne = null;
    let blackPawnPositionTwo = null;
    if (color === 1) {
      let whitePawnPositionOne = null;
      let whitePawnPositionTwo = null;
      if (whitePiecePos1-1 >= 0 && whitePiecePos2-1 >= 0) {
        whitePawnPositionOne = this.state.board[whitePiecePos1-1][whitePiecePos2-1].occupied;
      }
      if (whitePiecePos1-1 >= 0 && whitePiecePos2+1 <=7) {
        whitePawnPositionTwo = this.state.board[whitePiecePos1-1][whitePiecePos2+1].occupied;
      }
      if (whitePiecePos1-1 === pos[0]
        && (whitePiecePos2-1 === pos[1] || whitePiecePos2+1 === pos[1])
        && ((whitePawnPositionOne === bp) || (whitePawnPositionTwo === bp))) {
          this.setState({check: " White king is in Check1111" });
          if (whitePawnPositionOne === bp) {
            this.checkmatePawn(pos,whitePiecePos1-1,whitePiecePos2-1,1,arr);
          }
          if (whitePawnPositionTwo === bp) {
            alert(pos + " - " + (whitePiecePos1-1) + " - " + (whitePiecePos2+1) + " - " + 1 + " - " + arr);
            this.checkmatePawn(pos,whitePiecePos1-1,whitePiecePos2+1,1,arr);
          }
        } else {
          this.setState({check: null,blockCheckmate: false});
        }
      } else if (color === 2) {
        if (blackPiecePos1+1 <= 7 && blackPiecePos2-1 >= 0) {
          blackPawnPositionOne = this.state.board[blackPiecePos1+1][blackPiecePos2-1].occupied;
        }
        if (blackPiecePos1+1 <=7 && blackPiecePos2+1 <= 7) {
          blackPawnPositionTwo = this.state.board[blackPiecePos1+1][blackPiecePos2+1].occupied;
        }
        if (blackPiecePos1+1 === pos[0]
          && (blackPiecePos2-1 === pos[1] || blackPiecePos2+1 === pos[1])
          && ((blackPawnPositionOne === wp) || (blackPawnPositionTwo === wp))) {
            this.setState({check: " Black king is in Check22e" });
            if (blackPawnPositionOne === wp) {
      //        alert("1 pawn");
              this.checkmatePawn(pos,blackPiecePos1+1,blackPiecePos2-1,2,arr);
            }
            if (blackPawnPositionTwo === wp) {
      //        alert("2 pawn");
              this.checkmatePawn(pos,blackPiecePos1+1,blackPiecePos2+1,2,arr);
            }
          } else {
            this.setState({check: null,blockCheckmate: false});
          }
        }
      }
      checkmateBlockWithPawn(color,piecePos1,piecePos2,arr) {
        if (color === 1) {
          if (piecePos1 === 3 && this.state.board[piecePos1-1][piecePos2].occupied === null && this.state.board[piecePos1-2][piecePos2].occupied === bp) {
            arr.push(true);
          } else if (piecePos1 === 3 && piecePos1-1 >=0 && this.state.board[piecePos1-1][piecePos2].occupied === bp) {
            arr.push(true);
          }
        } else {
          if (piecePos1 === 4 && this.state.board[piecePos1+1][piecePos2].occupied === null && this.state.board[piecePos1+2][piecePos2].occupied === wp) {
            arr.push(true);
          }
          if (piecePos1+1 <=7 && this.state.board[piecePos1+1][piecePos2].occupied === wp) {
            arr.push(true);
          }
        }
      }
      checkmateTakeWithPawn(color,piecePos1,piecePos2,arr){

        if (color === 1) {
          if (piecePos1-1 >=0 && piecePos2-1 >=0 && this.state.board[piecePos1-1][piecePos2-1].occupied === bp) {
            arr.push(true);
          } else if (piecePos1-1 >=0 && piecePos2+1 <=7 && this.state.board[piecePos1-1][piecePos2+1].occupied === bp) {
            arr.push(true);
          }
        } else {
          if (piecePos1+1 <=7 && piecePos2-1 >=0 && this.state.board[piecePos1+1][piecePos2-1].occupied === wp) {
            arr.push(true);
      //      alert("first path");
          } else if (piecePos1+1 <=7 && piecePos2+1 <=7 && this.state.board[piecePos1+1][piecePos2+1].occupied === wp) {
            arr.push(true);
      //      alert("second path");
          }
        }
      }

      inCheck(pos,isGameOver,isGameOverCanKingMove) {
        let checkingPiece = ["","","",""];
        if (this.state.click === 1) {
          this.checkByPawn(pos,1,'no',this.state.whiteKingPos[0],this.state.whiteKingPos[1],this.state.blackKingPos[0],this.state.blackKingPos[1],isGameOver);
          this.checkByPawn(pos,2,'no',this.state.whiteKingPos[0],this.state.whiteKingPos[1],this.state.blackKingPos[0],this.state.blackKingPos[1],isGameOver);
          this.checkByRook(pos,1,true,this.state.whiteKingPos[0],this.state.whiteKingPos[1],isGameOver,checkingPiece);
          this.checkByRook(pos,2,true,this.state.blackKingPos[0],this.state.blackKingPos[1],isGameOver,checkingPiece);
          this.checkByBishop(pos,1,true,this.state.whiteKingPos[0],this.state.whiteKingPos[1],isGameOver,checkingPiece);
          this.checkByBishop(pos,2,true,this.state.blackKingPos[0],this.state.blackKingPos[1],isGameOver,checkingPiece);
          this.checkByKnight(pos,1,false,this.state.whiteKingPos[0],this.state.whiteKingPos[1],isGameOver);
          this.checkByKnight(pos,2,false,this.state.blackKingPos[0],this.state.blackKingPos[1],isGameOver);
      //    this.moveOutOfCheckmate(pos,1,this.state.whiteKingPos[0],this.state.whiteKingPos[1],isGameOverCanKingMove,checkingPiece);
    //alert(checkingPiece);
        this.moveOutOfCheckmate(pos,2,this.state.blackKingPos[0],this.state.blackKingPos[1],isGameOverCanKingMove,checkingPiece);
        }
      }
      moveOutOfCheckmate(pos,color,piecePos1,piecePos2,isGameOverCanKingMove,checkingPiece){
        //checkingPiece = [];
        let spacesAroundKing = [[piecePos1-1,piecePos2-1],[piecePos1-1,piecePos2],[piecePos1-1,piecePos2+1],[piecePos1,piecePos2-1],[piecePos1,piecePos2+1],[piecePos1+1,piecePos2-1],[piecePos1+1,piecePos2],[piecePos1+1,piecePos2+1]];
        let arrCheckmate = [];
        let test = [];
        let moveKingOutOfCheck = [];
        let newColor;
        if (color === 1) {
          newColor = "black";
        } else {
          newColor = "white";
        }

        for (let i=0; i< spacesAroundKing.length; i++) {
          if ((spacesAroundKing[i][0] >= 0 && spacesAroundKing[i][0] <= 7) && (spacesAroundKing[i][1] >= 0 && spacesAroundKing[i][1] <= 7)) {
            if (this.state.board[spacesAroundKing[i][0]][spacesAroundKing[i][1]].color === newColor || !this.state.board[spacesAroundKing[i][0]][spacesAroundKing[i][1]].occupied) {

              if (checkingPiece[0] === spacesAroundKing[i][1]){
                arrCheckmate.push(true);
              }
              if (checkingPiece[1] === spacesAroundKing[i][1]) {
                arrCheckmate.push(true);
              }
              if (checkingPiece[2] === spacesAroundKing[i][0]) {
                arrCheckmate.push(true);
              }
              if (checkingPiece[3] === spacesAroundKing[i][0]) {
                arrCheckmate.push(true);
              }

              if (checkingPiece[0][0]-checkingPiece[0][1] === spacesAroundKing[i][0]-spacesAroundKing[i][1]) {
                arrCheckmate.push(true);
              }
              if (checkingPiece[1][0]-checkingPiece[1][1] === spacesAroundKing[i][0]-spacesAroundKing[i][1]) {
                arrCheckmate.push(true);
              }
              if (checkingPiece[2][0]-checkingPiece[2][1] === spacesAroundKing[i][0]-spacesAroundKing[i][1]) {
                arrCheckmate.push(true);
              }
              if (checkingPiece[3][0]-checkingPiece[3][1] === spacesAroundKing[i][0]-spacesAroundKing[i][1]) {
                arrCheckmate.push(true);
              }




              this.checkByRook(pos,color,false,spacesAroundKing[i][0],spacesAroundKing[i][1],arrCheckmate);
              this.checkByBishop(pos,color,false,spacesAroundKing[i][0],spacesAroundKing[i][1],arrCheckmate);
              this.checkByKnight(pos,color,false,spacesAroundKing[i][0],spacesAroundKing[i][1],arrCheckmate);
              this.checkmateTakeWithPawn(color,spacesAroundKing[i][0],spacesAroundKing[i][1],arrCheckmate);
              test.push(" [ " + spacesAroundKing[i] + " ] " + " : " + arrCheckmate);

              if (arrCheckmate.length === 0) {
              //  alert("arrCheckmate")
                moveKingOutOfCheck.push(true);
              } else {
                arrCheckmate.length = 0;
              }
            }
          }
        }
    //    alert(test);
        if (moveKingOutOfCheck.length > 0) {
          //alert("works");
          isGameOverCanKingMove.push(true);
        }
      }

      checkmateRookQueen(pos,top,bottom,left,right,distTop,distBottom,distLeft,distRight,posTop,posBottom,posLeft,posRight,color,isGameOver) {
        let arrCheckmate = [];
        let isPieceProtected = [];
        let newColor;
        if (color === 1) {
          newColor = 2;
        } else {
          newColor = 1;
        }
        if (top) {
          for (let i=0; i < distTop-1; i++) {
            console.log(i + " top");
            if (color === 2) {
              this.checkByRook(pos,newColor,false,posTop[0]+i,posTop[1],arrCheckmate);
              this.checkByBishop(pos,newColor,false,posTop[0]+i,posTop[1],arrCheckmate);
              this.checkByKnight(pos,newColor,false,posTop[0]+i,posTop[1],arrCheckmate);
              if (posTop[0]+i <=7 && i === 0) {
                this.checkmateTakeWithPawn(newColor,posTop[0]+i,posTop[1],arrCheckmate);
              }
            }
          }
          if (distTop-1===0 && arrCheckmate.length === 0) {
    //        alert("bottom");
            this.checkByRook(pos,color,false,posTop[0],posTop[1],isPieceProtected);
            this.checkByBishop(pos,color,false,posTop[0],posTop[1],isPieceProtected);
            this.checkByKnight(pos,color,false,posTop[0],posTop[1],isPieceProtected);
            this.checkmateTakeWithPawn(color,posTop[0],posTop[1],isPieceProtected);
    //        alert("IsWhiteprotected : " + isPieceProtected);
            if (isPieceProtected.length > 0) {
              isGameOver.push(true);
              isPieceProtected.length = 0;
      //        alert("checkmate 1" + top + " " + bottom + " " + left + " " + right);
            }
          }
          if (arrCheckmate.length === 0 && distTop-1 !== 0) {
            isGameOver.push(true);
      //      alert("checkmate 1" + top + " " + bottom + " " + left + " " + right);
          }
        }
        if (bottom) {
          for (let i=0; i < distBottom; i++) {
            console.log(i + " bottom");
            this.checkByRook(pos,newColor,false,posBottom[0]-i,posBottom[1],arrCheckmate);
            this.checkByBishop(pos,newColor,false,posBottom[0]-i,posBottom[1],arrCheckmate);
            this.checkByKnight(pos,newColor,false,posBottom[0]-i,posBottom[1],arrCheckmate);
            if (posBottom[0]-i >=0 && i === 0) {
              this.checkmateTakeWithPawn(newColor,posBottom[0]-i,posBottom[1],arrCheckmate);
            }
          }
          if (distBottom-1===0 && arrCheckmate.length === 0) {
        //    alert("bottom");
            this.checkByRook(pos,color,false,posBottom[0],posBottom[1],isPieceProtected);
            this.checkByBishop(pos,color,false,posBottom[0],posBottom[1],isPieceProtected);
            this.checkByKnight(pos,color,false,posBottom[0],posBottom[1],isPieceProtected);
            this.checkmateTakeWithPawn(color,posBottom[0],posBottom[1],isPieceProtected);
    //        alert("IsWhiteprotected : " + isPieceProtected);
            if (isPieceProtected.length > 0) {
              isGameOver.push(true);
              isPieceProtected.length = 0;
    //          alert("checkmate 1" + top + " " + bottom + " " + left + " " + right);
            }
          }
          if (arrCheckmate.length === 0 && distBottom-1 !== 0) {
            isGameOver.push(true);
    //        alert("checkmate 1" + top + " " + bottom + " " + left + " " + right);
          }
        }

        if (left) {
          for (let i=0; i < distLeft; i++) {
            console.log(i + " right");
            this.checkByRook(pos,newColor,false,posLeft[0],posLeft[1]+i,arrCheckmate);
            this.checkByBishop(pos,newColor,false,posLeft[0],posLeft[1]+i,arrCheckmate);            this.checkByKnight(pos,newColor,false,posLeft[0],posLeft[1]+i,arrCheckmate);
            if (posLeft[1]+i <=7 && i===0) {
              this.checkmateTakeWithPawn(newColor,posLeft[0],posLeft[1]+i,arrCheckmate);
            } else {
              this.checkmateBlockWithPawn(newColor,posLeft[0],posLeft[1]+i,arrCheckmate);
            }
          }
          if (distLeft-1===0 && arrCheckmate.length === 0) {
      //      alert("hiiii");
            this.checkByRook(pos,color,false,posLeft[0],posLeft[1],isPieceProtected);
            this.checkByBishop(pos,color,false,posLeft[0],posLeft[1],isPieceProtected);
            this.checkByKnight(pos,color,false,posLeft[0],posLeft[1],isPieceProtected);
            this.checkmateTakeWithPawn(color,posLeft[0],posLeft[1],isPieceProtected);
    //        alert("IsWhiteprotected : " + isPieceProtected);
            if (isPieceProtected.length > 0) {
              isGameOver.push(true);
              isPieceProtected.length = 0;
    //          alert("checkmate 1" + top + " " + bottom + " " + left + " " + right);
            }
          }
          if (arrCheckmate.length === 0 && distLeft-1 !== 0) {
            isGameOver.push(true);
        //    alert("checkmate 1" + top + " " + bottom + " " + left + " " + right);
          }

        }
        if (right) {
          for (let i=0; i < distRight; i++) {
            console.log(i + " left");
            this.checkByRook(pos,newColor,false,posRight[0],posRight[1]-i,arrCheckmate);
            this.checkByBishop(pos,newColor,false,posRight[0],posRight[1]-i,arrCheckmate);
            this.checkByKnight(pos,newColor,false,posRight[0],posRight[1]-i,arrCheckmate);
            if (posRight[1]-i >=0 && i===0) {
              this.checkmateTakeWithPawn(newColor,posRight[0],posRight[1]-i,arrCheckmate);
            } else {
              this.checkmateBlockWithPawn(newColor,posRight[0],posRight[1]-i,arrCheckmate);
            }
          }
          if (distRight-1===0 && arrCheckmate.length === 0) {
          //  alert("hiiii");
            this.checkByRook(pos,color,false,posRight[0],posRight[1],isPieceProtected);
            this.checkByBishop(pos,color,false,posRight[0],posRight[1],isPieceProtected);
            this.checkByKnight(pos,color,false,posRight[0],posRight[1],isPieceProtected);
            this.checkmateTakeWithPawn(color,posRight[0],posRight[1],isPieceProtected);
      //      alert("IsWhiteprotected : " + isPieceProtected);
            if (isPieceProtected.length > 0) {
              isGameOver.push(true);
              isPieceProtected.length = 0;
    //          alert("checkmate 1" + top + " " + bottom + " " + left + " " + right);
            }
          }
          if (arrCheckmate.length === 0 && distRight-1 !== 0) {
            isGameOver.push(true);
      //      alert("checkmate 1" + top + " " + bottom + " " + left + " " + right);
          }

        }
      }

      checkmateBishopQueen(pos,topLeft,topRight,bottomLeft,bottomRight,distTopLeft,distTopRight,distBottomLeft,distBottomRight,posTopLeft,posTopRight,posBottomLeft,posBottomRight,color,isGameOver){
        let arrCheckmate = [];
        let isPieceProtected = [];

        let newColor;
        if (color === 1) {
          newColor = 2;
        } else {
          newColor = 1;
        }

        if (topLeft) {
          for (let i=0; i < distTopLeft; i++) {
            this.checkByRook(pos,newColor,false,posTopLeft[0]+i,posTopLeft[1]+i,arrCheckmate);
            this.checkByBishop(pos,newColor,false,posTopLeft[0]+i,posTopLeft[1]+i,arrCheckmate);
            this.checkByKnight(pos,newColor,false,posTopLeft[0]+i,posTopLeft[1]+i,arrCheckmate);
            if (posTopLeft[0]+i <= 7 && posTopLeft[1]+i <=7 && i===0) {
              this.checkmateTakeWithPawn(newColor,posTopLeft[0]+i,posTopLeft[1]+i,arrCheckmate);
            } else {
              this.checkmateBlockWithPawn(newColor,posTopLeft[0]+i,posTopLeft[1]+i,arrCheckmate)
            }
          }
    //      alert("inner");
          if (distTopLeft-1===0 && arrCheckmate.length === 0) {

            this.checkByRook(pos,color,false,posTopLeft[0],posTopLeft[1],isPieceProtected);
            this.checkByBishop(pos,color,0,posTopLeft[0],posTopLeft[1],isPieceProtected);
            this.checkByKnight(pos,color,false,posTopLeft[0],posTopLeft[1],isPieceProtected);
            this.checkmateTakeWithPawn(color,posTopLeft[0],posTopLeft[1],isPieceProtected);
            //    alert("IsWhiteprotected : " + isPieceProtected);
            if (arrCheckmate.length > 0) {
              isGameOver.push(true);
              isPieceProtected.length = 0;
          //    alert("checkmate TLLLL");
            }
          }
          if (arrCheckmate.length === 0 && distTopLeft-1 !== 0) {
            isGameOver.push(true);
        //    alert("checkmate TL");
          }
        }
        if (topRight) {
          for (let i=0; i < distTopRight; i++) {

            this.checkByRook(pos,newColor,false,posTopRight[0]+i,posTopRight[1]-i,arrCheckmate);
            this.checkByBishop(pos,newColor,false,posTopRight[0]+i,posTopRight[1]-i,arrCheckmate);
            this.checkByKnight(pos,newColor,false,posTopRight[0]+i,posTopRight[1]-i,arrCheckmate);
            if (posTopRight[0]+i <= 7 && posTopRight[1]-i >= 0 && i===0) {
              this.checkmateTakeWithPawn(newColor,posTopRight[0]+i,posTopRight[1]-i,arrCheckmate);
            } else {
              this.checkmateBlockWithPawn(newColor,posTopRight[0]+i,posTopRight[1]-i,arrCheckmate)
            }
          }
          if (distTopRight-1===0 && arrCheckmate.length === 0) {
          //  alert(posTopRight[0] + " - " + posTopRight[1]);
            this.checkByRook(pos,color,false,posTopRight[0],posTopRight[1],isPieceProtected);
            this.checkByBishop(pos,color,false,posTopRight[0],posTopRight[1],isPieceProtected);
            this.checkByKnight(pos,color,false,posTopRight[0],posTopRight[1],isPieceProtected);
            this.checkmateTakeWithPawn(color,posTopRight[0],posTopRight[1],isPieceProtected);
            //      alert("IsWhiteprotected : " + isPieceProtected);
            if (isPieceProtected.length > 0) {
              isGameOver.push(true);
              isPieceProtected.length = 0;
        //      alert("checkmate TRrr");
            }
          }
           if (arrCheckmate.length === 0 && distTopRight-1 !== 0) {
            isGameOver.push(true);
      //      alert("checkmate TRRRRR");
          }
        }
        if (bottomLeft) {  ///////
          console.log(distBottomLeft);
          for (let i=0; i < distBottomLeft; i++) {
            this.checkByRook(pos,newColor,false,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
            this.checkByBishop(pos,newColor,false,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
            this.checkByKnight(pos,newColor,false,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
            if (posBottomLeft[0]-i >= 0 && posBottomLeft[1]+i <= 7 && i===0) {
              this.checkmateTakeWithPawn(newColor,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
            } else {
              this.checkmateBlockWithPawn(newColor,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate)
            }
          }
          if (distBottomLeft-1===0 && arrCheckmate.length === 0) {
            //        alert("bl");
            this.checkByRook(pos,color,false,posBottomLeft[0],posBottomLeft[1],isPieceProtected);
            this.checkByBishop(pos,color,false,posBottomLeft[0],posBottomLeft[1],isPieceProtected);
            this.checkByKnight(pos,color,false,posBottomLeft[0],posBottomLeft[1],isPieceProtected);
            this.checkmateTakeWithPawn(color,posBottomLeft[0],posBottomLeft[1],isPieceProtected);
            //    alert("IsWhiteprotected : " + isPieceProtected);
            if (isPieceProtected.length > 0) {
              isGameOver.push(true);
              isPieceProtected.length = 0;
    //                alert("checkmate BL");
            }
          }
          if (arrCheckmate.length === 0 && distBottomLeft-1 !== 0) {
            isGameOver.push(true);
        //              alert("checkmate BL");
          }
        }
        if (bottomRight) {
          //  alert("BR");
          for (let i=0; i < distBottomRight; i++) {
            this.checkByRook(pos,newColor,false,posBottomRight[0]-i,posBottomRight[1]-i,arrCheckmate);
            this.checkByBishop(pos,newColor,false,posBottomRight[0]-i,posBottomRight[1]-i,arrCheckmate);
            this.checkByKnight(pos,newColor,false,posBottomRight[0]-i,posBottomRight[1]-i,arrCheckmate);
            if (posBottomRight[0]-i >= 0 && posBottomRight[1]-i >=0 && i===0) {
              this.checkmateTakeWithPawn(newColor,posBottomRight[0]-i,posBottomRight[1]+i,arrCheckmate);
            } else {
              this.checkmateBlockWithPawn(newColor,posBottomRight[0]-i,posBottomRight[1]+i,arrCheckmate);
            }
          }
          if (distBottomRight-1===0 && arrCheckmate.length === 0) {
            //      alert("bottom");
            this.checkByRook(pos,color,false,posBottomRight[0],posBottomRight[1],isPieceProtected);
            this.checkByBishop(pos,color,false,posBottomRight[0],posBottomRight[1],isPieceProtected);
            this.checkByKnight(pos,color,false,posBottomRight[0],posBottomRight[1],isPieceProtected);
            this.checkmateTakeWithPawn(color,posBottomRight[0],posBottomRight[1],isPieceProtected);
            //    alert("IsWhiteprotected : " + isPieceProtected);
            if (isPieceProtected.length > 0) {
              isGameOver.push(true);
              isPieceProtected.length = 0;
        //      alert("checkmate BRRRRRR");
            }
          }

          if (arrCheckmate.length === 0 && distBottomRight-1 !== 0) {
            isGameOver.push(true);
      //      alert("checkmate BRR");
          }
        }

        console.log(pos,topLeft,topRight,bottomLeft,bottomRight,distTopLeft,distTopRight,distBottomLeft,distBottomRight,posTopLeft,posTopRight,posBottomLeft,posBottomRight);
      }
      checkmateRook(pos,piecePos1,piecePos2,color,isGameOver){
        this.checkByRook(pos,color,false,piecePos1,piecePos2,arrCheckmateWhite);
        this.checkByBishop(pos,color,false,piecePos1,piecePos2,arrCheckmateWhite);
        this.checkByKnight(pos,color,false,piecePos1,piecePos2,arrCheckmateWhite);
        this.checkmateTakeWithPawn(color,piecePos1,piecePos2,arrCheckmateWhite);
      }

      checkmatePawn(pos,piecePos1,piecePos2,color,isGameOver) {
        let arrCheckmateWhite = [];
        let arrCheckmateBlack = [];
        let isBlackPieceProtected = [];
        let isWhitePieceProtected = [];
        if (color === 1) {
          this.checkByRook(pos,2,false,piecePos1,piecePos2,arrCheckmateWhite);
          this.checkByBishop(pos,2,false,piecePos1,piecePos2,arrCheckmateWhite);
          this.checkByKnight(pos,2,false,piecePos1,piecePos2,arrCheckmateWhite);
          this.checkmateTakeWithPawn(2,piecePos1,piecePos2,arrCheckmateWhite);
        } else {
          this.checkByRook(pos,1,false,piecePos1,piecePos2,arrCheckmateBlack);
          this.checkByBishop(pos,1,false,piecePos1,piecePos2,arrCheckmateBlack);
          this.checkByKnight(pos,1,false,piecePos1,piecePos2,arrCheckmateBlack);
          this.checkmateTakeWithPawn(1,piecePos1,piecePos2,arrCheckmateBlack);
        }
        if (color === 1 && arrCheckmateWhite.length === 0) {
          this.checkByRook(pos,1,false,piecePos1,piecePos2,isBlackPieceProtected);
          this.checkByBishop(pos,1,false,piecePos1,piecePos2,isBlackPieceProtected);
          this.checkByKnight(pos,1,false,piecePos1,piecePos2,isBlackPieceProtected);
          this.checkmateTakeWithPawn(1,piecePos1,piecePos2,isBlackPieceProtected);
          if (isBlackPieceProtected.length > 0) {
            isGameOver.push(true);
    //        alert("checkmate One Pawn - " + isBlackPieceProtected);
          }
        }
        if (color === 2 && arrCheckmateBlack.length === 0) {
          this.checkByRook(pos,2,false,piecePos1,piecePos2,isWhitePieceProtected);
          this.checkByBishop(pos,2,false,piecePos1,piecePos2,isWhitePieceProtected);
          this.checkByKnight(pos,2,false,piecePos1,piecePos2,isWhitePieceProtected);
          this.checkmateTakeWithPawn(2,piecePos1,piecePos2,isWhitePieceProtected);
          if (isWhitePieceProtected.length > 0) {
            isGameOver.push(true);
      //      alert("checkmate Two Pawn - " + isWhitePieceProtected);
          }
        }
      }


      updateBoard(pos) {
        let newBoard = this.state.board.slice();
        let newTakenPiecesWhite = this.state.takenPiecesWhite.slice();
        let newTakenPiecesBlack = this.state.takenPiecesBlack.slice();
        if (this.state.board[pos[0]][pos[1]].occupied !== null) {
          let takenPiece = Object.assign({positionY: this.state.board[pos[0]][pos[1]].positionY, positionX: this.state.board[pos[0]][pos[1]].positionX, color: this.state.board[pos[0]][pos[1]].color, highlight: null, firstMove: this.state.board[pos[0]][pos[1]].firstMove, occupied: this.state.board[pos[0]][pos[1]].occupied, piece: this.state.board[pos[0]][pos[1]].piece}, {});
          if (this.state.board[pos[0]][pos[1]].color === 'white') {
            newTakenPiecesWhite.push(takenPiece);
            this.setState({takenPiecesWhite: newTakenPiecesWhite});
          } else if (this.state.board[pos[0]][pos[1]].color === 'black') {
            newTakenPiecesBlack.push(takenPiece);
            this.setState({takenPiecesBlack: newTakenPiecesBlack});
          }
        }
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

      selectTakenPiece(piece) {
        let newBoard = this.state.board.slice();
        let selectedPiece;
        if (this.state.switchPawn[0] === 0) {
          selectedPiece = this.state.selectPieceWhite[piece];
        } else {
          selectedPiece = this.state.selectPieceBlack[piece];
        }
        newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].occupied = selectedPiece.occupied;
        newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].color = selectedPiece.color;
        newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].piece = selectedPiece.piece;
        this.setState({board: newBoard});
        this.setState({switchPawn: [], showPieceSelectionModal: false});
      }

      movePawn(pos) {
        console.log('Pawn');
        let newBoard = this.state.board.slice();

        if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white' && pos[0] === this.state.moveFrom[0]-1 && pos[1] === this.state.moveFrom[1] && this.state.board[pos[0]][pos[1]].color !== 'black') {
          this.updateBoard(pos);
          if (pos[0] === 0 || pos[0] === 7) {
            this.setState({showPieceSelectionModal: true});
          }
        } else if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black' && pos[0] === this.state.moveFrom[0]+1 && pos[1] === this.state.moveFrom[1] && this.state.board[pos[0]][pos[1]].color !== 'white') {
          this.updateBoard(pos);
          if (pos[0] === 0 || pos[0] === 7) {
            this.setState({showPieceSelectionModal: true});
          }
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
          if (pos[0] === 0 || pos[0] === 7) {
            this.setState({showPieceSelectionModal: true});
          }
        } else if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black'
        && this.state.board[pos[0]][pos[1]].color === 'white' && ((this.state.moveFrom[0]+1 === pos[0] && this.state.moveFrom[1]-1 === pos[1])
        || (this.state.moveFrom[0]+1 === pos[0] && this.state.moveFrom[1]+1 === pos[1]))) {
          if (pos[0] === 0 || pos[0] === 7) {
            this.setState({showPieceSelectionModal: true});
          }
          this.updateBoard(pos);
        }
        if (pos[0] === 0 || pos[0] === 7) {
          this.setState({switchPawn: [pos[0],pos[1]]});
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
                    this.setState({blackKingMove: true, blackKingPos: pos});
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
                    let newSelectPieceWhite = this.state.selectPieceWhite.slice();
                    let newSelectPieceBlack = this.state.selectPieceBlack.slice();
                    let y,x;

                    let piecesToPopulateBoard = [{positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bp, piece: this.movePawn}, {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wp, piece: this.movePawn}, {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: br, piece: this.moveRook}, {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wr, piece: this.moveRook}, {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bkn, piece: this.moveKight}, {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wkn, piece: this.moveKight}, {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bb, piece: this.moveBishop}, {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wb, piece: this.moveBishop}, {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bq, piece: this.moveQueen}, {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wq, piece: this.moveQueen}, {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bk, piece: this.moveKing}, {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wk, piece: this.moveKing}]

                    let objectArr = [];

                    for (let i = 0; i < 8; i++) {
                      for (let a = 0; a < 8; a++) {
                        y = i;
                        x = a;
                        if (i === 1) {
                          //black pawn
                          objectArr.push(Object.assign({},piecesToPopulateBoard[0]));
                        } else if (i === 6) {
                          // white pawn
                          objectArr.push(Object.assign({},piecesToPopulateBoard[1]));

                        } else if ((i === 0 && a === 0) || (i === 0 && a === 7)) {
                          // black rook
                          objectArr.push(Object.assign({},piecesToPopulateBoard[2]));
                        } else if ((i === 7 && a === 0) || (i === 7 && a === 7)) {
                          // white rook
                          objectArr.push(Object.assign({},piecesToPopulateBoard[3]));

                        } else if ((i === 0 && a === 1) || (i === 0 && a === 6)) {
                          // black knight
                          objectArr.push(Object.assign({},piecesToPopulateBoard[4]));
                        } else if ((i === 7 && a === 1) || (i === 7 && a === 6)) {
                          // white knight
                          objectArr.push(Object.assign({},piecesToPopulateBoard[5]));

                        } else if ((i === 0 && a === 2) || (i === 0 && a === 5)) {
                          // black bishop
                          objectArr.push(Object.assign({},piecesToPopulateBoard[6]));
                        } else if ((i === 7 && a === 2) || (i === 7 && a === 5)) {
                          // white bishop
                          objectArr.push(Object.assign({},piecesToPopulateBoard[7]));

                        } else if (i === 0 && a === 3) {
                          // black queen
                          objectArr.push(piecesToPopulateBoard[8]);
                        } else if (i === 7 && a === 3) {
                          // white queen
                          objectArr.push(piecesToPopulateBoard[9]);

                        } else if (i === 0 && a === 4) {
                          // black king
                          objectArr.push(piecesToPopulateBoard[10]);
                        } else if (i === 7 && a === 4) {
                          // white king
                          objectArr.push(piecesToPopulateBoard[11]);

                        } else {
                          let test2 = Object.assign({positionY: i, positionX: a, color: null, highlight: null, firstMove: true, occupied: null, piece: null});
                          objectArr.push(test2);
                        }
                        if (a === 7) {
                          newBoard.push(objectArr);
                          objectArr = [];
                        }

                      }
                    }
                    newSelectPieceWhite.push(Object.assign({},piecesToPopulateBoard[3]),Object.assign({},piecesToPopulateBoard[5]),Object.assign({},piecesToPopulateBoard[7]),Object.assign({},piecesToPopulateBoard[9]));
                    newSelectPieceBlack.push(Object.assign({},piecesToPopulateBoard[2]),Object.assign({},piecesToPopulateBoard[4]),Object.assign({},piecesToPopulateBoard[6]),Object.assign({},piecesToPopulateBoard[8]));
                    this.setState({board: newBoard,selectPieceWhite: newSelectPieceWhite,selectPieceBlack: newSelectPieceBlack});
                    console.log(this.state.board.length);
                  }


                  componentWillMount(){
                    this.populateBoard();
                  }


                  movePiece(pos){
                    let isGameOver = [];
                    let isGameOverCanKingMove = [];
                    //  this.setState({test: "new"});
                    let newBoard = this.state.board.slice();
                    /////////////
                    //  this.inCheck(pos); //////////
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
                      } else if (!newBoard[pos[0]][pos[1]].highlight) {

                        newBoard[pos[0]][pos[1]].highlight = Object.assign({border: 'solid',borderWidth: 'thick',borderColor: 'green'}, {});
                        newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].highlight = null;

                        this.setState({moveFrom: [pos[0],pos[1]]});
                        this.setState({board: newBoard});

                      }
                    }
                    //    this.setState({board: newBoard})
                    console.log(this.state.board);
                    this.inCheck(pos,isGameOver,isGameOverCanKingMove);
                    if (isGameOver.length > 0 && isGameOverCanKingMove.length === 0) {
                //      alert("is game over : " + isGameOver);
                    }
                  }

                  render(){
                    const main = {
                      width: 600,
                      padding: 15,
                      marginRight: 'auto',
                      marginLeft: 'auto'

                    }
                    return (
                      <div style={main}>
                      Top: {this.state.rookPositions.top}
                      <br/>
                      Bottom: {this.state.rookPositions.bottom}
                      <br/>
                      Left: {this.state.rookPositions.left}
                      <br/>
                      Right: {this.state.rookPositions.right}
                      <p>Rook: {this.state.blockCheckmateRook}</p>
                      <p>click {this.state.click}</p>
                      <ChessBoard movePiece={this.movePiece} check={this.state.check} board={this.state.board}/>
                      <PiecesTaken takenPiecesWhite={this.state.takenPiecesWhite} takenPiecesBlack={this.state.takenPiecesBlack}/>

                      <PiecesToSelect selectTakenPiece={this.selectTakenPiece} selectPieceWhite={this.state.selectPieceWhite} selectPieceBlack={this.state.selectPieceBlack}
                      switchPawn={this.state.switchPawn} showPieceSelectionModal={this.state.showPieceSelectionModal}/>

                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>

                      </div>
                    );
                  }

                }
                // App.propTypes = {
                //   populateBoard: PropTypes.func
                // };

                export default MainBoard;
