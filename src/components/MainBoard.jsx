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
      board: [],
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
      rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}
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
  }

  checkByRook(pos,color,isKing,piecesPos1,piecePos2,arr){
    //this.setState({rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}});

    let newRookPositions = {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []};
    let newBlockCheckmateRook = "";

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
          this.setState({rookPositions: newRookPositions});
        }
      }
    //rook down
      for (let i=1; i < 8-kingPosY; i++) {
        if (this.state.board[kingPosY+i][kingPosX].occupied === rookPieceColor || this.state.board[kingPosY+i][kingPosX].occupied === queenPieceColor) {
          rookDown = true;
          distanceToKingDown.push(i);
          newRookPositions.distanceBottom = distanceToKingDown;
          this.setState({rookPositions: newRookPositions});
        }
      }
      //rook left
      for (let i=1; i < kingPosX+1; i++) {
        if (this.state.board[kingPosY][kingPosX-i].occupied === rookPieceColor || this.state.board[kingPosY][kingPosX-i].occupied === queenPieceColor) {
          rookLeft = true;
          distanceToKingLeft.push(i);
          newRookPositions.distanceLeft = distanceToKingLeft;
          this.setState({rookPositions: newRookPositions});
        }
      }
      //rook right
      for (let i=1; i < 8 - kingPosX; i++) {
        if (this.state.board[kingPosY][kingPosX+i].occupied === rookPieceColor || this.state.board[kingPosY][kingPosX+i].occupied === queenPieceColor) {
          rookRight = true;
          distanceToKingRight.push(i);
          newRookPositions.distanceRight = distanceToKingRight
          this.setState({rookPositions: newRookPositions});
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
          } else {

      //      this.setState({blockCheckmateRook: "true up"});
      newBlockCheckmateRook = "true up";
      arr.push(newBlockCheckmateRook);
      //          alert("block up "+this.state.blockCheckmateRook);
          }

        } else {
            newBlockCheckmateRook = "false";
        //  this.setState({blockCheckmateRook: "false"});
      //    newRookPositions.top = [];
        //  this.setState({rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}});
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
          } else {

      //      this.setState({blockCheckmateRook: "true down"});
      newBlockCheckmateRook = "true down";
      arr.push(newBlockCheckmateRook);
           //alert("block Down " + color + " " + this.state.blockCheckmateRook);
          }
        } else {
            newBlockCheckmateRook = "false";
      //    this.setState({blockCheckmateRook: "false"});
      //    newRookPositions.bottom = [];
        //  this.setState({rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}});
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
          } else {

        //    this.setState({blockCheckmateRook: "true left"});
        newBlockCheckmateRook = "true left";
        arr.push(newBlockCheckmateRook);
      //          alert("block left " + this.state.blockCheckmateRook);
          }
        } else {
            newBlockCheckmateRook = "false";
        //  this.setState({blockCheckmateRook: "false"});
    //      newRookPositions.left = [];
        //  this.setState({rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}});
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
            this.setState({check: colorOfKing + " king is in Check" });
            runCheckmateTest = true;
          } else {

          //  this.setState({blockCheckmateRook: "true right"});
          newBlockCheckmateRook = "true right";
          arr.push(newBlockCheckmateRook);
      //          alert("Block right " + this.state.blockCheckmateRook);
          }
        } else {
          newBlockCheckmateRook = "false";
        //  this.setState({blockCheckmateRook: "false"});
    //      newRookPositions.right = [];
        //  this.setState({rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}});
        }
      }

    }

    this.setState({rookPositions: newRookPositions});
    this.setState({blockCheckmateRook: newBlockCheckmateRook});

    if (isKing && runCheckmateTest) {
  // this.checkByRook(pos,1,false,pos[0],pos[1]);
this.checkmate(pos,newRookPositions.top,newRookPositions.bottom,newRookPositions.left,newRookPositions.right,newRookPositions.distanceTop[0],newRookPositions.distanceBottom[0],newRookPositions.distanceLeft[0],newRookPositions.distanceRight[0]);
} else {
      console.log(pos,newRookPositions.top,newRookPositions.bottom,newRookPositions.left,newRookPositions.right,newRookPositions.distanceTop[0],newRookPositions.distanceBottom[0],newRookPositions.distanceLeft[0],newRookPositions.distanceRight[0]);
}
let test;
if (runCheckmateTest && (!newRookPositions.top && !newRookPositions.bottom && !newRookPositions.left && !newRookPositions.right)) {
  test = "not checkmate";
  this.setState({check: "checkmate"});
}



  }

  checkByBishop(pos,color,isKing,piecesPos1,piecePos2) {
    let kingPieceColor;
    let bishopPieceColor;
    let queenPieceColor;
    let colorOfKing;
    let kingPosY;
    let kingPosX;
    if (color === 1) {
      kingPieceColor = wk;
      bishopPieceColor = bb;
      queenPieceColor = bq;
      colorOfKing = " White";
      kingPosY = piecesPos1
      kingPosX = piecePos2
    } else if (color === 2) {
      kingPieceColor = bk;
      bishopPieceColor = wb;
      queenPieceColor = wq;
      colorOfKing = " Black";
      kingPosY = piecesPos1;
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
        console.log("tl path 1");
      } else {
        tl = kingPosY+1;
        console.log("tl path 2");
      }

      for (let i=1; i < tl; i++) {
        if (this.state.board[kingPosY-i][kingPosX-i].occupied === bishopPieceColor || this.state.board[kingPosY-i][kingPosX-i].occupied === queenPieceColor) {
          bishopTopLeft = true;
          console.log("topleft " + tl);
          distanceTopLeft.push(i);
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
          console.log("topRight " + tr);
          console.log("EDDIE " + tr);
          distanceTopRight.push(i);
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
          console.log("bottomLeft");
          console.log("EDDIE " + bl);
          distanceBottomLeft.push(i);
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
          console.log("bottomRight");
          console.log("EDDIE " + br);
          distanceBottomRight.push(i);
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
          if (isKing === true) {
            this.setState({check: colorOfKing + " king is in Check TL" });
          } else {
            this.setState({blockCheckmate: true});
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
          if (isKing === true) {
            this.setState({check: colorOfKing + " king is in Check TR" });
          } else {
            this.setState({blockCheckmate: true});
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
          if (isKing === true) {
            this.setState({check: colorOfKing + " king is in Check BL" });
          } else {
            this.setState({blockCheckmate: true});
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
          if (isKing === true) {
            this.setState({check: colorOfKing + " king is in Check BR" });
          } else {
            this.setState({blockCheckmate: true});
          }
        }
      }
    }
  }
  checkByKnight(pos,color,isKing,piecePos1,piecePos2){
    let kingPieceColor;
    let knightPieceColor;
    let colorOfKing;

    if (color === 1) {
      kingPieceColor = wk;
      knightPieceColor = bkn;
      colorOfKing = " White";
    } else if (color === 2) {
      kingPieceColor = bk;
      knightPieceColor = wkn;
      colorOfKing = " Black";
    }
    if (
      (piecePos1-2 === pos[0] && piecePos2-1 === pos[1] && this.state.board[piecePos1-2][piecePos2-1].occupied === knightPieceColor)
      || (piecePos1-2 === pos[0] && piecePos2+1 === pos[1] && this.state.board[piecePos1-2][piecePos2+1].occupied === knightPieceColor)
      || (piecePos1-1 === pos[0] && piecePos2-2 === pos[1] && this.state.board[piecePos1-1][piecePos2-2].occupied === knightPieceColor)
      || (piecePos1-1 === pos[0] && piecePos2+2 === pos[1] && this.state.board[piecePos1-1][piecePos2+2].occupied === knightPieceColor)
      || (piecePos1+1 === pos[0] && piecePos2-2 === pos[1] && this.state.board[piecePos1+1][piecePos2-2].occupied === knightPieceColor)
      || (piecePos1+1 === pos[0] && piecePos2+2 === pos[1] && this.state.board[piecePos1+1][piecePos2+2].occupied === knightPieceColor)
      || (piecePos1+2 === pos[0] && piecePos2-1 === pos[1] && this.state.board[piecePos1+2][piecePos2-1].occupied === knightPieceColor)
      || (piecePos1+2 === pos[0] && piecePos2+1 === pos[1] && this.state.board[piecePos1+2][piecePos2+1].occupied === knightPieceColor)
    ) {
      this.setState({check: colorOfKing + " king is in Check" });
      //black knight
    }
  }
  checkByPawn(pos,color,isKing,whitePiecePos1,whitePiecePos2,blackPiecePos1,blackPiecePos2){
    if (whitePiecePos1-1 === pos[0]
      && (whitePiecePos2-1 === pos[1] || whitePiecePos2+1 === pos[1])
      && ((whitePiecePos2 !== 0 && this.state.board[whitePiecePos1-1][whitePiecePos2-1].occupied) === bp || (whitePiecePos2 !== 7 && this.state.board[whitePiecePos1-1][whitePiecePos2+1].occupied === bp))) {
        this.setState({check: " White king is in Check" });
      } else if (blackPiecePos1+1 === pos[0]
        && (blackPiecePos2-1 === pos[1] || blackPiecePos2+1 === pos[1])
        && ((blackPiecePos2 !== 0 && this.state.board[blackPiecePos1+1][blackPiecePos2-1].occupied) === wp || (blackPiecePos2 !== 7 && this.state.board[blackPiecePos1+1][blackPiecePos2+1].occupied === wp))) {
          this.setState({check: " Black king is in Check" });
        } else {
          this.setState({check: null,blockCheckmate: false});
        }
      }

      inCheck(pos) {
        if (this.state.click === 1) {
      //   this.setState({rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}});

          this.checkByPawn(pos,1,'no',this.state.whiteKingPos[0],this.state.whiteKingPos[1],this.state.blackKingPos[0],this.state.blackKingPos[1]);
          this.checkByRook(pos,1,true,this.state.whiteKingPos[0],this.state.whiteKingPos[1]);
          this.checkByRook(pos,2,true,this.state.blackKingPos[0],this.state.blackKingPos[1]);
          this.checkByBishop(pos,1,true,this.state.whiteKingPos[0],this.state.whiteKingPos[1]);
          this.checkByBishop(pos,2,true,this.state.blackKingPos[0],this.state.blackKingPos[1]);
          this.checkByKnight(pos,1,false,this.state.whiteKingPos[0],this.state.whiteKingPos[1]);
          this.checkByKnight(pos,2,false,this.state.blackKingPos[0],this.state.blackKingPos[1]);

        }
      }

      checkmate(pos,top,bottom,left,right,distTop,distBottom,distLeft,distRight) {

      //  this.setState({rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}});

        let arrCheckmate = [];
        this.setState({blockCheckmateRook: "false"});
        //rook ---Checking piece
        if (top) {
      //      alert(distTop + " Top");
          for (let i=0; i < distTop-1; i++) {
            console.log(i + " top")
            this.checkByRook(pos,1,false,pos[0]+i,pos[1],arrCheckmate);
    //        this.checkByRook(pos,2,false,pos[0],pos[1]);
      //    alert("checkmate up " + this.state.blockCheckmateRook);
          }
        }
        if (bottom) {
        //  alert(distBottom + " Bottom");
          for (let i=0; i < distBottom; i++) {
            console.log(i + " bottom");
            this.checkByRook(pos,1,false,pos[0]-i,pos[1],arrCheckmate);
        //    this.checkByRook(pos,2,false,pos[0],pos[1]);
        //    alert("checkmate down " + this.state.blockCheckmateRook);
          }
        }
        if (left) {
        //  alert("left - " + distLeft);
          for (let i=0; i < distLeft; i++) {
          //  alert(distRight + " Left");
          console.log(i + " right");
            this.checkByRook(pos,1,false,pos[0],pos[1]+i,arrCheckmate);
        //    this.checkByRook(pos,2,false,pos[0],pos[1]);
      //    alert("checkmate left " + this.state.blockCheckmateRook);
          }
        }
        if (right) {
      //    alert("right");
          for (let i=0; i < distRight; i++) {
            console.log(i + " left");
        //    alert(distLeft + " Right");
            this.checkByRook(pos,1,false,pos[0],pos[1]-i,arrCheckmate);
        //    this.checkByRook(pos,2,false,pos[0],pos[1]);
        //    alert("checkmate right " + this.state.blockCheckmateRook);
          }
        }
        if (arrCheckmate.length === 0) {
          //  alert("checkmate");
        }

      }


      updateBoard(pos) {
        //this.inCheck();
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
        newBoard[pos[0]][pos[1]].occupied = newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].positionY;
        newBoard[pos[0]][pos[1]].occupied = newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].positionX;
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
        //alert(this.state.switchPawn[0]);
      }


      ///Add piece detection. First move can jump a piece.

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
                    this.inCheck(pos);
              //      this.checkByRook(pos,1,false,pos[0],pos[1]);
                    //  if (this.state.check) {
                  //  this.checkmate(pos);
              //     }

                      // this.setState({rookPositions: {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: []}});
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
