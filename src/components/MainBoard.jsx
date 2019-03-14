import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import PiecesTaken from './PiecesTaken';
import PiecesToSelect from './PiecesToSelect';
import ChessBoard from './ChessBoard';
import GameOver from './GameOver';
import HowToPlay from './HowToPlay';
import OnlinePlayModal from './OnlinePlayModal';
import AboutModal from './AboutModal';

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
import Firebase from 'firebase';
import firebaseConfig from '../firebaseConfig';

class MainBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      emptyBoardPositionObj: {positionY: null, positionX: null, color: null, highlight: null, firstMove: true, occupied: null, piece: null},
      whitePiecesStaleMate: [],
      blackPiecesStaleMate: [],
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
      playerTurn: 'white',
      check: null,
      showPieceSelectionModal: false,
      showGameOverModal: false,
      howToPlayModal: false,
      onlinePlayModal: false,
      aboutModal: false,
      gameOverBy: '',
    };
    this.populateBoard = this.populateBoard.bind(this);
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
    this.firebaseBoard = this.firebaseBoard.bind(this);
    this.closeHowToPlayModal = this.closeHowToPlayModal.bind(this);
    this.openHowToPlayModal = this.openHowToPlayModal.bind(this);
    this.closeOnlinePlayModal = this.closeOnlinePlayModal.bind(this);
    this.openOnlinePlayModal = this.openOnlinePlayModal.bind(this);
    this.updateStateFromDatabase = this.updateStateFromDatabase.bind(this);
    this.closeAboutModal = this.closeAboutModal.bind(this);
    this.openAboutModal = this.openAboutModal.bind(this);

  }
  updateStateFromDatabase(resetClick){
    let dbBoard = firebase.database().ref('board');
    dbBoard.on('value',(snapshot)=> {
      let boardDatabase = snapshot.val();
      this.updateBoardFromDatabase(boardDatabase);
    });

    let db = firebase.database().ref('check');
    db.on('value',(snapshot)=> {
    let checkDatabase = snapshot.val();
    this.setState({check: checkDatabase.check});
  });


  let dbClick = firebase.database().ref('click');
  dbClick.on('value',(snapshot)=> {
  let clickDatabase = snapshot.val();
  this.setState({click: clickDatabase.move});
  });

  let dbTurn = firebase.database().ref('playerTurn');
  dbTurn.on('value',(snapshot)=> {
  let turnDatabase = snapshot.val();
  this.setState({playerTurn: turnDatabase.turn});
  if (resetClick === 1 && turnDatabase.turn === 'white') {
    let clickDatabase = firebase.database().ref('click');
    clickDatabase.set({move: 0});
  }
  if (resetClick === 2 && turnDatabase.turn === 'black') {
    let clickDatabase = firebase.database().ref('click');
    clickDatabase.set({move: 0});
  }

  });
/////
  let dbWhiteCastling = firebase.database().ref('whiteKingCastling');
  dbWhiteCastling.on('value',(snapshot)=> {
  let wkDatabase = snapshot.val();
  this.setState({whiteKingMove: wkDatabase.whiteKing});
  });

  let dbWhitePosition = firebase.database().ref('whiteKingPos');
  dbWhitePosition.on('value',(snapshot)=> {
  let wkPosition = snapshot.val();
  this.setState({whiteKingPos: wkPosition.position});
  });
//
  let dbBlackCastling = firebase.database().ref('blackKingCastling');
  dbBlackCastling.on('value',(snapshot)=> {
  let wkDatabase = snapshot.val();
  this.setState({blackKingMove: wkDatabase.blackKing});
  });

  let dbBlackPosition = firebase.database().ref('blackKingPos');
  dbBlackPosition.on('value',(snapshot)=> {
  let bkPosition = snapshot.val();
  this.setState({blackKingPos: bkPosition.position});
  });
  let dbModal = firebase.database().ref('gameOverModal');
  dbModal.on('value',(snapshot)=> {
  let gameOverModal = snapshot.val();
  this.setState({showGameOverModal: gameOverModal.gameOver});
  });
  let dbGameOver = firebase.database().ref('gameOverBy');
  dbGameOver.on('value',(snapshot)=> {
  let gameOver = snapshot.val();
  this.setState({gameOverBy: gameOver.gameOver});
  });
  }

  checkByRook(pos,color,isKing,piecesPos1,piecePos2,arr,checkingPiece,testBoardLegalMove){
    let newRookPositions = {top: false, bottom: false, left: false, right: false, distanceTop: [], distanceBottom: [], distanceLeft: [], distanceRight: [], positionTop: [], positionBottom: [], positionLeft: [], positionRight: []};
    let newBoard;
    let newCheck;
    if (testBoardLegalMove) {
      newBoard = testBoardLegalMove;
    } else {
      newBoard = this.state.board.slice();
    }
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
      colorOfKing = ' White';
      kingPosY = piecesPos1;
      kingPosX = piecePos2;
    } else if (color === 2) {
      kingPieceColor = bk;
      rookPieceColor = wr;
      queenPieceColor = wq;
      colorOfKing = ' Black';
      kingPosY = piecesPos1;
      kingPosX = piecePos2;
    }
    let rookUp = false, rookDown = false, rookLeft = false, rookRight = false;
    let distanceToKingUp = [], distanceToKingDown = [], distanceToKingLeft = [], distanceToKingRight = [];
    //allows king to move out of check
    if (newBoard[pos[0]][pos[1]].occupied === kingPieceColor && !testBoardLegalMove && isKing) {
  //    this.setState({check: null});
    } else {
      //rook up
      for (let i=1; i < kingPosY+1; i++) {
        if (newBoard[kingPosY-i][kingPosX].occupied === rookPieceColor || newBoard[kingPosY-i][kingPosX].occupied === queenPieceColor) {
          rookUp = true;
          distanceToKingUp.push(i);
          newRookPositions.distanceTop = distanceToKingUp;
          newRookPositions.positionTop.push([kingPosY-i,kingPosX]);
        }
      }
      //rook down
      for (let i=1; i < 8-kingPosY; i++) {
        if (newBoard[kingPosY+i][kingPosX].occupied === rookPieceColor || newBoard[kingPosY+i][kingPosX].occupied === queenPieceColor) {
          rookDown = true;
          distanceToKingDown.push(i);
          newRookPositions.distanceBottom = distanceToKingDown;
          newRookPositions.positionBottom.push([kingPosY+i,kingPosX]);
        }
      }
      //rook left
      for (let i=1; i < kingPosX+1; i++) {
        if (newBoard[kingPosY][kingPosX-i].occupied === rookPieceColor || newBoard[kingPosY][kingPosX-i].occupied === queenPieceColor) {
          rookLeft = true;
          distanceToKingLeft.push(i);
          newRookPositions.distanceLeft = distanceToKingLeft;
          newRookPositions.positionLeft.push([kingPosY,kingPosX-i]);
        }
      }
      //rook right
      for (let i=1; i < 8 - kingPosX; i++) {
        if (newBoard[kingPosY][kingPosX+i].occupied === rookPieceColor || newBoard[kingPosY][kingPosX+i].occupied === queenPieceColor) {
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
          if (newBoard[kingPosY-i][kingPosX].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newRookPositions.top = true;
          if (isKing) {
            newCheck = colorOfKing + ' king is in Check';
        //    this.setState({check: colorOfKing + ' king is in Check' });
            runCheckmateTest = true;
            checkingPiece[0] = kingPosX;
          } else {
            arr.push('up');
          }
        }
      }
      //rook down
      if (rookDown === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceToKingDown[0]; i++) {
          if (newBoard[kingPosY+i][kingPosX].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newRookPositions.bottom = true;
          if (isKing) {
            newCheck = colorOfKing + ' king is in Check';
          //  this.setState({check: colorOfKing + ' king is in Check' });
            runCheckmateTest = true;
            checkingPiece[1] = kingPosX;
          } else {
            arr.push(kingPosY + ' , ' + kingPosX);
          }
        }
      }
      //rook left
      if (rookLeft === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceToKingLeft[0]; i++) {
          if (newBoard[kingPosY][kingPosX-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newRookPositions.left = true;
          if (isKing) {
            newCheck = colorOfKing + ' king is in Check';
          //  this.setState({check: colorOfKing + ' king is in Check' });
            runCheckmateTest = true;
            checkingPiece[2] = kingPosY;
          } else {
            arr.push('left');
          }
        }
      }
      //rook right
      if (rookRight === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceToKingRight[0]; i++) {
          if (newBoard[kingPosY][kingPosX+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newRookPositions.right = true;
          if (isKing === true) {
            newCheck = colorOfKing + ' king is in Check';
            //this.setState({check: colorOfKing + ' king is in Check' });
            runCheckmateTest = true;
            checkingPiece[3] = kingPosY;
          } else {
            arr.push('right');
          }
        }
      }
    }
    if (isKing && runCheckmateTest && (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo')) {
      let db = firebase.database().ref('check');
      db.set({check: newCheck});
    } else if (isKing && runCheckmateTest) {
      this.setState({check: newCheck});
    }

    if (isKing && runCheckmateTest && !testBoardLegalMove) {
      this.checkmateRookQueen(pos,newRookPositions.top,newRookPositions.bottom,newRookPositions.left,newRookPositions.right,newRookPositions.distanceTop[0],newRookPositions.distanceBottom[0],newRookPositions.distanceLeft[0],newRookPositions.distanceRight[0],newRookPositions.positionTop[0],newRookPositions.positionBottom[0],newRookPositions.positionLeft[0],newRookPositions.positionRight[0],color,arr);
    }
  }

  checkByBishop(pos,color,isKing,piecePos1,piecePos2,arr,checkingPiece,testBoardLegalMove) {
    let newBishopQueenPositions = {topLeft: false, topRight: false, bottomLeft: false, bottomRight: false, distanceTopLeft: [], distanceTopRight: [], distanceBottomLeft: [], distanceBottomRight: [], positionTopLeft: [], positionTopRight: [], positionBottomLeft: [], positionBottomRight: []};
    let newBoard;
    let newCheck;
    if (testBoardLegalMove) {
      newBoard = testBoardLegalMove;
    } else {
      newBoard = this.state.board.slice();
    }
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
      colorOfKing = ' White';
      kingPosY = piecePos1;
      kingPosX = piecePos2;
    } else if (color === 2) {
      kingPieceColor = bk;
      bishopPieceColor = wb;
      queenPieceColor = wq;
      colorOfKing = ' Black';
      kingPosY = piecePos1;
      kingPosX = piecePos2;
    }
    let tl, tr, bl, br;
    let bishopTopLeft = false, bishopTopRight = false, bishopBottomLeft = false, bishopBottomRight = false;
    let distanceTopLeft = [], distanceTopRight = [], distanceBottomLeft = [], distanceBottomRight = [];

    //allows king to move out of check
    if (newBoard[pos[0]][pos[1]].occupied === kingPieceColor && !testBoardLegalMove && isKing) {
      this.setState({check: null});
    } else {
      //bishop Top left
      if (kingPosY >= kingPosX) {
        tl = kingPosX+1;
      } else {
        tl = kingPosY+1;
      }

      for (let i=1; i < tl; i++) {
        if (newBoard[kingPosY-i][kingPosX-i].occupied === bishopPieceColor || newBoard[kingPosY-i][kingPosX-i].occupied === queenPieceColor) {
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
        if (newBoard[kingPosY-i][kingPosX+i].occupied === bishopPieceColor || newBoard[kingPosY-i][kingPosX+i].occupied === queenPieceColor) {
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
        if (newBoard[kingPosY+i][kingPosX-i].occupied === bishopPieceColor || newBoard[kingPosY+i][kingPosX-i].occupied === queenPieceColor) {
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
        if (newBoard[kingPosY+i][kingPosX+i].occupied === bishopPieceColor || newBoard[kingPosY+i][kingPosX+i].occupied === queenPieceColor) {
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
          if (newBoard[kingPosY-i][kingPosX-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newBishopQueenPositions.topLeft = true;
          if (isKing) {
            newCheck = colorOfKing + ' king is in Check';
      //      this.setState({check: colorOfKing + ' king is in Check' });
            runCheckmateTest = true;
            checkingPiece[0] = [kingPosY,kingPosX];
          } else {
            arr.push(true);
          }
        }
      }
      //bishop top right
      if (bishopTopRight === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceTopRight[0]; i++) {
          if (newBoard[kingPosY-i][kingPosX+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }

        if (pieceBlocking === 0) {
          newBishopQueenPositions.topRight = true;
          if (isKing) {
            newCheck = colorOfKing + ' king is in Check';
          //  this.setState({check: colorOfKing + ' king is in Check' });
            runCheckmateTest = true;
            checkingPiece[1] = [kingPosY,kingPosX];
          } else {
            arr.push(true);
          }
        }
      }
      //bishop bottom left
      if (bishopBottomLeft === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceBottomLeft[0]; i++) {
          if (newBoard[kingPosY+i][kingPosX-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newBishopQueenPositions.bottomLeft = true;
          if (isKing) {
            newCheck = colorOfKing + ' king is in Check';
        //    this.setState({check: colorOfKing + ' king is in Check' });
            runCheckmateTest = true;
            checkingPiece[2] = [kingPosY,kingPosX];
          } else {
            arr.push(true);
          }
        }
      }
      //bishop bottom right
      if (bishopBottomRight === true) {
        let pieceBlocking = 0;
        for (let i=1; i < distanceBottomRight[0]; i++) {
          if (newBoard[kingPosY+i][kingPosX+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
        if (pieceBlocking === 0) {
          newBishopQueenPositions.bottomRight = true;
          if (isKing) {
            newCheck = colorOfKing + ' king is in Check';
          //  this.setState({check: colorOfKing + ' king is in Check' });
            runCheckmateTest = true;
            checkingPiece[3] = [kingPosY,kingPosX];
          } else {
            arr.push(true);
          }
        }
      }
    }

    if (isKing && runCheckmateTest && (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo')) {

      let db = firebase.database().ref('check');
      db.set({check: newCheck});
    } else if (isKing && runCheckmateTest) {
      this.setState({check: newCheck});
    }


    if (isKing && runCheckmateTest && !testBoardLegalMove) {
      this.checkmateBishopQueen(pos,newBishopQueenPositions.topLeft,newBishopQueenPositions.topRight,newBishopQueenPositions.bottomLeft,newBishopQueenPositions.bottomRight,newBishopQueenPositions.distanceTopLeft[0],newBishopQueenPositions.distanceTopRight[0],newBishopQueenPositions.distanceBottomLeft[0],newBishopQueenPositions.distanceBottomRight[0],newBishopQueenPositions.positionTopLeft[0],newBishopQueenPositions.positionTopRight[0],newBishopQueenPositions.positionBottomLeft[0],newBishopQueenPositions.positionBottomRight[0],color,arr);
    }
  }
  checkByKnight(pos,color,isKing,piecePos1,piecePos2,arr,newTestBoard){
    let kingPieceColor;
    let knightPieceColor;
    let colorOfKing;
    let newCheck;
    let newBoard;
    if (newTestBoard) {
      newBoard = newTestBoard;
    } else {
      newBoard = this.state.board.slice();
    }

    if (color === 1) {
      kingPieceColor = wk;
      knightPieceColor = bkn;
      colorOfKing = ' White';
    } else if (color === 2) {
      kingPieceColor = bk;
      knightPieceColor = wkn;
      colorOfKing = ' Black';
    }
    if (isKing) {
      if (
        (piecePos1-2 === pos[0] && piecePos2-1 === pos[1] && newBoard[piecePos1-2][piecePos2-1].occupied === knightPieceColor)
        || (piecePos1-2 === pos[0] && piecePos2+1 === pos[1] && newBoard[piecePos1-2][piecePos2+1].occupied === knightPieceColor)
        || (piecePos1-1 === pos[0] && piecePos2-2 === pos[1] && newBoard[piecePos1-1][piecePos2-2].occupied === knightPieceColor)
        || (piecePos1-1 === pos[0] && piecePos2+2 === pos[1] && newBoard[piecePos1-1][piecePos2+2].occupied === knightPieceColor)
        || (piecePos1+1 === pos[0] && piecePos2-2 === pos[1] && newBoard[piecePos1+1][piecePos2-2].occupied === knightPieceColor)
        || (piecePos1+1 === pos[0] && piecePos2+2 === pos[1] && newBoard[piecePos1+1][piecePos2+2].occupied === knightPieceColor)
        || (piecePos1+2 === pos[0] && piecePos2-1 === pos[1] && newBoard[piecePos1+2][piecePos2-1].occupied === knightPieceColor)
        || (piecePos1+2 === pos[0] && piecePos2+1 === pos[1] && newBoard[piecePos1+2][piecePos2+1].occupied === knightPieceColor)
      ) {
        newCheck = colorOfKing + ' king is in Check';

        if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
          let db = firebase.database().ref('check');
          db.set({check: newCheck});
        } else {
          this.setState({check: newCheck});
        }
      //  this.setState({check: colorOfKing + ' king is in Check'});
        this.checkmateKnight(pos,piecePos1,piecePos2,color,arr);
        //black knight
      }
    }
    if (!isKing) {
      if (
        (piecePos1-2 >=0 && piecePos2-1 >=0 && newBoard[piecePos1-2][piecePos2-1].occupied === knightPieceColor)
        || (piecePos1-2 >=0 && piecePos2+1 <=7 && newBoard[piecePos1-2][piecePos2+1].occupied === knightPieceColor)
        || (piecePos1-1 >=0 && piecePos2-2 >=0 && newBoard[piecePos1-1][piecePos2-2].occupied === knightPieceColor)
        || (piecePos1-1 >=0 && piecePos2+2 <=7 && newBoard[piecePos1-1][piecePos2+2].occupied === knightPieceColor)
        || (piecePos1+1 <=7 && piecePos2-2 >=0 && newBoard[piecePos1+1][piecePos2-2].occupied === knightPieceColor)
        || (piecePos1+1 <=7 && piecePos2+2 <=7 && newBoard[piecePos1+1][piecePos2+2].occupied === knightPieceColor)
        || (piecePos1+2 <=7 && piecePos2-1 >=0 && newBoard[piecePos1+2][piecePos2-1].occupied === knightPieceColor)
        || (piecePos1+2 <=7 && piecePos2+1 <=7 && newBoard[piecePos1+2][piecePos2+1].occupied === knightPieceColor)
      ) {
        arr.push(true);
      }
    }
  }
  checkByPawn(pos,color,isKing,whitePiecePos1,whitePiecePos2,blackPiecePos1,blackPiecePos2,arr) {
    let blackPawnPositionOne = null;
    let blackPawnPositionTwo = null;
    let newCheck;
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
        newCheck = ' White king is in Check';
        this.setState({check: ' White king is in Check' });
        if (whitePawnPositionOne === bp) {            this.checkmatePawn(pos,whitePiecePos1-1,whitePiecePos2-1,1,arr);
        }
        if (whitePawnPositionTwo === bp) {
          this.checkmatePawn(pos,whitePiecePos1-1,whitePiecePos2+1,1,arr);
        }
      } else {
          newCheck = null;
          let db = firebase.database().ref('check');
          db.set({check: ''});
          this.setState({check: null});
          // let db = firebase.database().ref('check');
          // db.set({check: ""});
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
          newCheck = ' Black king is in Check';
          this.setState({check: ' Black king is in Check' });
          if (blackPawnPositionOne === wp) {
            this.checkmatePawn(pos,blackPiecePos1+1,blackPiecePos2-1,2,arr);
          }
          if (blackPawnPositionTwo === wp) {
            this.checkmatePawn(pos,blackPiecePos1+1,blackPiecePos2+1,2,arr);
          }
        } else {
          newCheck = null;
          this.setState({check: null});
          let db = firebase.database().ref('check');
          db.set({check: ''});
        }
      }
      if (newCheck && (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo')) {
        let db = firebase.database().ref('check');
        db.set({check: newCheck});
      } else if (!newCheck && (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo')) {
          // let db = firebase.database().ref('check');
          // db.set({check: ''});
      } else {
      //    this.setState({check: newCheck});
      }
  }
  checkmateBlockWithPawn(color,piecePos1,piecePos2,arr) {
    if (color === 1) {
      if (piecePos1 === 3 && this.state.board[piecePos1-1][piecePos2].occupied === null && this.state.board[piecePos1-2][piecePos2].occupied === bp) {
        arr.push(true);
      }
      if (piecePos1-1 >=0 && this.state.board[piecePos1-1][piecePos2].occupied === bp) {
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
  checkmateTakeWithPawn(color,piecePos1,piecePos2,arr,testBoardLegalMove){
    let newBoard;
    if (testBoardLegalMove) {
      newBoard = testBoardLegalMove;
    } else {
      newBoard = this.state.board.slice();
    }
    if (color === 1) {
      if (piecePos1-1 >=0 && piecePos2-1 >=0 && newBoard[piecePos1-1][piecePos2-1].occupied === bp) {
        arr.push(true);
      } else if (piecePos1-1 >=0 && piecePos2+1 <=7 && newBoard[piecePos1-1][piecePos2+1].occupied === bp) {
        arr.push(true);
      }
    } else {
      if (piecePos1+1 <=7 && piecePos2-1 >=0 && newBoard[piecePos1+1][piecePos2-1].occupied === wp) {
        arr.push(true);
      } else if (piecePos1+1 <=7 && piecePos2+1 <=7 && newBoard[piecePos1+1][piecePos2+1].occupied === wp) {
        arr.push(true);
      }
    }
  }

  inCheck(pos,color,isGameOver,isGameOverCanKingMove,stalemate) {
    let checkingPiece = ['','','',''];
    let kingPosY;
    let kingPosX;
    if (color === 1) {
      kingPosY = this.state.whiteKingPos[0];
      kingPosX = this.state.whiteKingPos[1];
    } else {
      kingPosY = this.state.blackKingPos[0];
      kingPosX = this.state.blackKingPos[1];
    }
    if (this.state.click === 1 || stalemate) {
      this.checkByPawn(pos,color,'no',this.state.whiteKingPos[0],this.state.whiteKingPos[1],this.state.blackKingPos[0],this.state.blackKingPos[1],isGameOver);
      this.checkByRook(pos,color,true,kingPosY,kingPosX,isGameOver,checkingPiece);
      this.checkByBishop(pos,color,true,kingPosY,kingPosX,isGameOver,checkingPiece);
      this.checkByKnight(pos,color,true,kingPosY,kingPosX,isGameOver);
      ////////
      this.moveOutOfCheckmate(pos,color,kingPosY,kingPosX,isGameOverCanKingMove,checkingPiece);

      let testArr = [];
      this.testForStalemate(pos,color,testArr);
      if (testArr.length === 0 && isGameOverCanKingMove.length === 0 && !this.state.check) {
        if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
          let dbModal = firebase.database().ref('gameOverModal');
          dbModal.set({gameOver: true});
          let dbGameOver = firebase.database().ref('gameOverBy');
          dbGameOver.set({gameOver: 'Checkmate'});
        } else {
          this.setState({showGameOverModal: true, gameOverBy: 'Stalemate'});
        }
      }
      console.log('HELLLO',color,testArr);
    }
  }
  moveOutOfCheckmate(pos,color,piecePos1,piecePos2,isGameOverCanKingMove,checkingPiece){
    let spacesAroundKing = [[piecePos1-1,piecePos2-1],[piecePos1-1,piecePos2],[piecePos1-1,piecePos2+1],[piecePos1,piecePos2-1],[piecePos1,piecePos2+1],[piecePos1+1,piecePos2-1],[piecePos1+1,piecePos2],[piecePos1+1,piecePos2+1]];
    let arrCheckmate = [];
    let moveKingOutOfCheck = [];
    let newColor;
    if (color === 1) {
      newColor = 'black';
    } else {
      newColor = 'white';
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
          if (arrCheckmate.length === 0) {
            moveKingOutOfCheck.push(true);
          } else {
            arrCheckmate.length = 0;
          }
        }
      }
    }
    if (moveKingOutOfCheck.length > 0) {
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
      for (let i=0; i < distTop; i++) {
        console.log(i + ' top');
        this.checkByRook(pos,newColor,false,posTop[0]+i,posTop[1],arrCheckmate);
        this.checkByBishop(pos,newColor,false,posTop[0]+i,posTop[1],arrCheckmate);
        this.checkByKnight(pos,newColor,false,posTop[0]+i,posTop[1],arrCheckmate);
        if (posTop[0]+i <=7 && i === 0) {
          this.checkmateTakeWithPawn(newColor,posTop[0]+i,posTop[1],arrCheckmate);
        }
      }
      if (distTop-1===0 && arrCheckmate.length === 0) {
        this.checkByRook(pos,color,false,posTop[0],posTop[1],isPieceProtected);
        this.checkByBishop(pos,color,false,posTop[0],posTop[1],isPieceProtected);
        this.checkByKnight(pos,color,false,posTop[0],posTop[1],isPieceProtected);
        this.checkmateTakeWithPawn(color,posTop[0],posTop[1],isPieceProtected);
        if (isPieceProtected.length > 0) {
          isGameOver.push('top1');
          isPieceProtected.length = 0;
        }
      }
      if (arrCheckmate.length === 0 && distTop-1 !== 0) {
        isGameOver.push('top2');
      }
    }
    if (bottom) {
      for (let i=0; i < distBottom; i++) {
        console.log(i + ' bottom');
        this.checkByRook(pos,newColor,false,posBottom[0]-i,posBottom[1],arrCheckmate);
        this.checkByBishop(pos,newColor,false,posBottom[0]-i,posBottom[1],arrCheckmate);
        this.checkByKnight(pos,newColor,false,posBottom[0]-i,posBottom[1],arrCheckmate);
        if (posBottom[0]-i >=0 && i === 0) {
          this.checkmateTakeWithPawn(newColor,posBottom[0]-i,posBottom[1],arrCheckmate);
        }
      }
      if (distBottom-1===0 && arrCheckmate.length === 0) {
        this.checkByRook(pos,color,false,posBottom[0],posBottom[1],isPieceProtected);
        this.checkByBishop(pos,color,false,posBottom[0],posBottom[1],isPieceProtected);
        this.checkByKnight(pos,color,false,posBottom[0],posBottom[1],isPieceProtected);
        this.checkmateTakeWithPawn(color,posBottom[0],posBottom[1],isPieceProtected);
        if (isPieceProtected.length > 0) {
          isGameOver.push('bottom');
          isPieceProtected.length = 0;
        }
      }
      if (arrCheckmate.length === 0 && distBottom-1 !== 0) {
        isGameOver.push('bottom');
      }
    }
    if (left) {
      for (let i=0; i < distLeft; i++) {
        console.log(i + ' right');
        this.checkByRook(pos,newColor,false,posLeft[0],posLeft[1]+i,arrCheckmate);
        this.checkByBishop(pos,newColor,false,posLeft[0],posLeft[1]+i,arrCheckmate);            this.checkByKnight(pos,newColor,false,posLeft[0],posLeft[1]+i,arrCheckmate);
        if (posLeft[1]+i <=7 && i===0) {
          this.checkmateTakeWithPawn(newColor,posLeft[0],posLeft[1]+i,arrCheckmate);
        } else {
          this.checkmateBlockWithPawn(newColor,posLeft[0],posLeft[1]+i,arrCheckmate);
        }
      }
      if (distLeft-1===0 && arrCheckmate.length === 0) {
        this.checkByRook(pos,color,false,posLeft[0],posLeft[1],isPieceProtected);
        this.checkByBishop(pos,color,false,posLeft[0],posLeft[1],isPieceProtected);
        this.checkByKnight(pos,color,false,posLeft[0],posLeft[1],isPieceProtected);
        this.checkmateTakeWithPawn(color,posLeft[0],posLeft[1],isPieceProtected);
        if (isPieceProtected.length > 0) {
          isGameOver.push('left');
          isPieceProtected.length = 0;
        }
      }
      if (arrCheckmate.length === 0 && distLeft-1 !== 0) {
        isGameOver.push('left');
      }
    }
    if (right) {
      for (let i=0; i < distRight; i++) {
        console.log(i + ' left');
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
        this.checkByRook(pos,color,false,posRight[0],posRight[1],isPieceProtected);
        this.checkByBishop(pos,color,false,posRight[0],posRight[1],isPieceProtected);
        this.checkByKnight(pos,color,false,posRight[0],posRight[1],isPieceProtected);
        this.checkmateTakeWithPawn(color,posRight[0],posRight[1],isPieceProtected);
        if (isPieceProtected.length > 0) {
          isGameOver.push('right');
          isPieceProtected.length = 0;
        }
      }
      if (arrCheckmate.length === 0 && distRight-1 !== 0) {
        isGameOver.push('Right');
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
          this.checkmateBlockWithPawn(newColor,posTopLeft[0]+i,posTopLeft[1]+i,arrCheckmate);
        }
      }
      if (distTopLeft-1===0 && arrCheckmate.length === 0) {
        this.checkByRook(pos,color,false,posTopLeft[0],posTopLeft[1],isPieceProtected);
        this.checkByBishop(pos,color,0,posTopLeft[0],posTopLeft[1],isPieceProtected);
        this.checkByKnight(pos,color,false,posTopLeft[0],posTopLeft[1],isPieceProtected);
        this.checkmateTakeWithPawn(color,posTopLeft[0],posTopLeft[1],isPieceProtected);
        if (arrCheckmate.length > 0) {
          isGameOver.push('TL');
          isPieceProtected.length = 0;
        }
      }
      if (arrCheckmate.length === 0 && distTopLeft-1 !== 0) {
        isGameOver.push('TL');
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
          this.checkmateBlockWithPawn(newColor,posTopRight[0]+i,posTopRight[1]-i,arrCheckmate);
        }
      }
      if (distTopRight-1===0 && arrCheckmate.length === 0) {
        this.checkByRook(pos,color,false,posTopRight[0],posTopRight[1],isPieceProtected);
        this.checkByBishop(pos,color,false,posTopRight[0],posTopRight[1],isPieceProtected);
        this.checkByKnight(pos,color,false,posTopRight[0],posTopRight[1],isPieceProtected);
        this.checkmateTakeWithPawn(color,posTopRight[0],posTopRight[1],isPieceProtected);
        if (isPieceProtected.length > 0) {
          isGameOver.push('TR');
          isPieceProtected.length = 0;
        }
      }
      if (arrCheckmate.length === 0 && distTopRight-1 !== 0) {
        isGameOver.push('TR');
      }
    }
    if (bottomLeft) {
      console.log(distBottomLeft);
      for (let i=0; i < distBottomLeft; i++) {
        this.checkByRook(pos,newColor,false,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
        this.checkByBishop(pos,newColor,false,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
        this.checkByKnight(pos,newColor,false,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
        if (posBottomLeft[0]-i >= 0 && posBottomLeft[1]+i <= 7 && i===0) {
          this.checkmateTakeWithPawn(newColor,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
        } else {
          this.checkmateBlockWithPawn(newColor,posBottomLeft[0]-i,posBottomLeft[1]+i,arrCheckmate);
        }
      }
      if (distBottomLeft-1===0 && arrCheckmate.length === 0) {
        this.checkByRook(pos,color,false,posBottomLeft[0],posBottomLeft[1],isPieceProtected);
        this.checkByBishop(pos,color,false,posBottomLeft[0],posBottomLeft[1],isPieceProtected);
        this.checkByKnight(pos,color,false,posBottomLeft[0],posBottomLeft[1],isPieceProtected);
        this.checkmateTakeWithPawn(color,posBottomLeft[0],posBottomLeft[1],isPieceProtected);
        if (isPieceProtected.length > 0) {
          isGameOver.push('BL');
          isPieceProtected.length = 0;
        }
      }
      if (arrCheckmate.length === 0 && distBottomLeft-1 !== 0) {
        isGameOver.push('BL');
      }
    }
    if (bottomRight) {
      for (let i=0; i < distBottomRight; i++) {
        this.checkByRook(pos,newColor,false,posBottomRight[0]-i,posBottomRight[1]-i,arrCheckmate);
        this.checkByBishop(pos,newColor,false,posBottomRight[0]-i,posBottomRight[1]-i,arrCheckmate);
        this.checkByKnight(pos,newColor,false,posBottomRight[0]-i,posBottomRight[1]-i,arrCheckmate);
        if (posBottomRight[0]-i >= 0 && posBottomRight[1]-i >=0 && i===0) {
          this.checkmateTakeWithPawn(newColor,posBottomRight[0]-i,posBottomRight[1]-i,arrCheckmate);
        } else {
          this.checkmateBlockWithPawn(newColor,posBottomRight[0]-i,posBottomRight[1]-i,arrCheckmate);
        }
      }
      if (distBottomRight-1===0 && arrCheckmate.length === 0) {
        this.checkByRook(pos,color,false,posBottomRight[0],posBottomRight[1],isPieceProtected);
        this.checkByBishop(pos,color,false,posBottomRight[0],posBottomRight[1],isPieceProtected);
        this.checkByKnight(pos,color,false,posBottomRight[0],posBottomRight[1],isPieceProtected);
        this.checkmateTakeWithPawn(color,posBottomRight[0],posBottomRight[1],isPieceProtected);
        if (isPieceProtected.length > 0) {
          isGameOver.push('BR');
          isPieceProtected.length = 0;
        }
      }
      if (arrCheckmate.length === 0 && distBottomRight-1 !== 0) {
        isGameOver.push('BR');
      }
    }
    console.log(pos,topLeft,topRight,bottomLeft,bottomRight,distTopLeft,distTopRight,distBottomLeft,distBottomRight,posTopLeft,posTopRight,posBottomLeft,posBottomRight);
  }

  checkmateKnight(pos,piecePos1,piecePos2,color,isGameOver){
    let arrCheckmate = [];
    if (color === 1) {
      this.checkByRook(pos,2,false,piecePos1,piecePos2,arrCheckmate);
      this.checkByBishop(pos,2,false,piecePos1,piecePos2,arrCheckmate);
      this.checkByKnight(pos,2,false,piecePos1,piecePos2,arrCheckmate);
      this.checkmateTakeWithPawn(2,piecePos1,piecePos2,arrCheckmate);
    } else {
      this.checkByRook(pos,1,false,piecePos1,piecePos2,arrCheckmate);
      this.checkByBishop(pos,1,false,piecePos1,piecePos2,arrCheckmate);
      this.checkByKnight(pos,1,false,piecePos1,piecePos2,arrCheckmate);
      this.checkmateTakeWithPawn(1,piecePos1,piecePos2,arrCheckmate);
    }
    if (arrCheckmate.length === 0) {
      isGameOver.push('checkmateKnight');
    }
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
        isGameOver.push('checkmatepawn1');
      }
    }
    if (color === 2 && arrCheckmateBlack.length === 0) {
      this.checkByRook(pos,2,false,piecePos1,piecePos2,isWhitePieceProtected);
      this.checkByBishop(pos,2,false,piecePos1,piecePos2,isWhitePieceProtected);
      this.checkByKnight(pos,2,false,piecePos1,piecePos2,isWhitePieceProtected);
      this.checkmateTakeWithPawn(2,piecePos1,piecePos2,isWhitePieceProtected);
      if (isWhitePieceProtected.length > 0) {
        isGameOver.push('checkmatepawn2');
      }
    }
  }
  updateBoard(pos,testCheckBoard) {
    let newBoard;
    let newWhitePiecesStaleMate = this.state.whitePiecesStaleMate;
    let newBlackPiecesStaleMate = this.state.blackPiecesStaleMate;
    if (testCheckBoard) {
      newBoard = testCheckBoard;
    } else {
      newBoard = this.state.board.slice();
    }
    let newTakenPiecesWhite = this.state.takenPiecesWhite.slice();
    let newTakenPiecesBlack = this.state.takenPiecesBlack.slice();
    if (this.state.board[pos[0]][pos[1]].occupied !== null && !testCheckBoard) {
      let takenPiece = Object.assign({positionY: this.state.board[pos[0]][pos[1]].positionY, positionX: this.state.board[pos[0]][pos[1]].positionX, color: this.state.board[pos[0]][pos[1]].color, highlight: null, firstMove: this.state.board[pos[0]][pos[1]].firstMove, occupied: this.state.board[pos[0]][pos[1]].occupied}, {});
      //displays taken pieces below the board
      if (this.state.board[pos[0]][pos[1]].color === 'white') {
        newTakenPiecesWhite.push(takenPiece);
        if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
          let post = newTakenPiecesWhite.length-1;
          let dbTakenPiecesWhite = firebase.database().ref('piecesTakenWhite/'+post);
          dbTakenPiecesWhite.set({piece: takenPiece});
        }
        this.setState({takenPiecesWhite: newTakenPiecesWhite});

      } else if (this.state.board[pos[0]][pos[1]].color === 'black') {
        newTakenPiecesBlack.push(takenPiece);
        if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
          let post = newTakenPiecesBlack.length-1;
          let dbTakenPiecesBlack = firebase.database().ref('piecesTakenBlack/'+post);
          dbTakenPiecesBlack.set({piece: takenPiece});
        }
        this.setState({takenPiecesBlack: newTakenPiecesBlack});
      }
      //removes taken pieces from whitePiecesStaleMate and blackPiecesStaleMate arrays
      if (newBoard[pos[0]][pos[1]].color !== null && newBoard[pos[0]][pos[1]].color !== newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color) {
        if (newBoard[pos[0]][pos[1]].color === 'white') {
          let test = newWhitePiecesStaleMate.indexOf(newBoard[pos[0]][pos[1]]);
          newWhitePiecesStaleMate.splice(test,1);
        } else if (newBoard[pos[0]][pos[1]].color === 'black') {
          let test = newBlackPiecesStaleMate.indexOf(newBoard[pos[0]][pos[1]]);
          newBlackPiecesStaleMate.splice(test,1);
        }
      }
    }
    if (!testCheckBoard && (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo')) {
      this.updateDatabase(pos);
      let playerTurnDatabase = firebase.database().ref('playerTurn');
      if (this.state.click === 1) {
        if (this.state.playerTurn === 'white') {
          playerTurnDatabase.set({turn:'black'});
        } else if (this.state.playerTurn === 'black') {
          playerTurnDatabase.set({turn:'white'});
        }
      }
      //    } else {
      //      this.setState({check: newCheck});
    }
    newBoard[pos[0]][pos[1]] = newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]];
    newBoard[pos[0]][pos[1]].positionY = pos[0];
    newBoard[pos[0]][pos[1]].positionX = pos[1];
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].highlight = null;
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]] = Object.assign({},this.state.emptyBoardPositionObj);
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].positionY = this.state.moveFrom[0];
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].positionX = this.state.moveFrom[1];
    console.log('first',newBoard);
    console.log(this.state.whitePiecesStaleMate);
    console.log(this.state.blackPiecesStaleMate);

    if (newBoard[pos[0]][pos[1]].firstMove === true) {
      newBoard[pos[0]][pos[1]].firstMove = false;
    }
    if (!testCheckBoard) {
      if (this.state.click === 1) {
        if (this.state.playerTurn === 'white') {
          this.setState({playerTurn: 'black'});
        } else if (this.state.playerTurn === 'black') {
          this.setState({playerTurn: 'white'});
        }
      }
      if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
        let clickDatabase = firebase.database().ref('click');
        clickDatabase.set({move: 0});
      } else {
        this.setState({click: 0});
      }

      // clickDatabase.on('value',(snapshot)=> {
      // let clickDatabase = snapshot.val();
      //   this.setState({click: clickDatabase.move});
      // });

      this.setState({whitePiecesStaleMate: newWhitePiecesStaleMate, blackPiecesStaleMate: newBlackPiecesStaleMate});
    }
  }

  selectTakenPieceFromDatabase(piece,color){
    let newSelectPiece;
    if (color === 2) {
      newSelectPiece = this.state.selectPieceWhite.slice();
    } else {
      newSelectPiece = this.state.selectPieceBlack.slice();
    }
    if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
      let pieceMovementArr = [this.moveKight,this.moveRook,this.moveBishop,this.moveQueen];
      let newPiece;
      let pieceMovementPlaceholder = ['knight','rook','bishop','queen'];
      for (let i=0; i < 6; i++) {
        if (newSelectPiece[piece].piece === pieceMovementArr[i]) {
          newPiece = pieceMovementPlaceholder[i];
        }
      }
      let dbSwitchPiece = firebase.database().ref('board/'+this.state.switchPawn[0]+'/'+this.state.switchPawn[1]);
      dbSwitchPiece.set({
        positionY: this.state.switchPawn[0],
        positionX: this.state.switchPawn[1],
        color: newSelectPiece[piece].color,
        highlight: null,
        firstMove: false,
        occupied: newSelectPiece[piece].occupied,
        piece: newPiece
      });
    }
  }
  selectTakenPiece(piece) {
    let newBoard = this.state.board.slice();
    let newSelectPieceWhite = this.state.selectPieceWhite.slice();
    let newSelectPieceBlack = this.state.selectPieceBlack.slice();
    let isGameOver = [];
    let isGameOverCanKingMove = [];
    let color;
    if (newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].color === 'white') {
      color = 2;
    } else if (newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].color === 'black') {
      color = 1;
    }
    if (this.state.switchPawn[0] === 0) {
      this.selectTakenPieceFromDatabase(piece,color);
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].positionY = this.state.switchPawn[0];
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].positionX = this.state.switchPawn[1];
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].occupied = newSelectPieceWhite[piece].occupied;
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].color = newSelectPieceWhite[piece].color;
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].piece = newSelectPieceWhite[piece].piece;
    } else if (this.state.switchPawn[0] === 7) {
      this.selectTakenPieceFromDatabase(piece,color);
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].positionY = this.state.switchPawn[0];
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].positionX = this.state.switchPawn[1];
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].occupied = newSelectPieceBlack[piece].occupied;
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].color = newSelectPieceBlack[piece].color;
      newBoard[this.state.switchPawn[0]][this.state.switchPawn[1]].piece = newSelectPieceBlack[piece].piece;
    }
    this.setState({board: newBoard,switchPawn: [], showPieceSelectionModal: false});
    this.inCheck(this.state.switchPawn,color,isGameOver,isGameOverCanKingMove,true);
    if (isGameOver.length > 0 && isGameOverCanKingMove.length === 0) {
      if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
        let db = firebase.database().ref('gameOverModal');
        db.set({gameOver: true});
      }
      this.setState({showGameOverModal: true, gameOverBy: 'Checkmate'});
    }
  }

  movePawn(pos,testCheckBoard) {
    //      console.log('Pawn');
    let newBoard;
    if (testCheckBoard) {
      newBoard = testCheckBoard;
    } else {
      newBoard = this.state.board.slice();
    }

    if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white' && pos[0] === this.state.moveFrom[0]-1 && pos[1] === this.state.moveFrom[1] && newBoard[pos[0]][pos[1]].color !== 'black') {
      this.updateBoard(pos,testCheckBoard);
      if ((pos[0] === 0 || pos[0] === 7) && !testCheckBoard) {
        this.setState({showPieceSelectionModal: true});
      }
    } else if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black' && pos[0] === this.state.moveFrom[0]+1 && pos[1] === this.state.moveFrom[1] && newBoard[pos[0]][pos[1]].color !== 'white') {
      this.updateBoard(pos,testCheckBoard);
      if ((pos[0] === 0 || pos[0] === 7) && !testCheckBoard) {
        this.setState({showPieceSelectionModal: true});
      }
      //first move. two spaces up
    } else if (this.state.moveFrom[0] === 6 && newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white' && pos[0] === this.state.moveFrom[0]-2 && pos[1] === this.state.moveFrom[1] && newBoard[this.state.moveFrom[0]-1][this.state.moveFrom[1]].occupied === null && newBoard[pos[0]][pos[1]].color !== 'black') {
      this.updateBoard(pos,testCheckBoard);
    } else if (this.state.moveFrom[0] === 1 && newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black' && pos[0] === this.state.moveFrom[0]+2 && pos[1] === this.state.moveFrom[1] && newBoard[this.state.moveFrom[0]+1][this.state.moveFrom[1]].occupied === null && newBoard[pos[0]][pos[1]].color !== 'white') {
      this.updateBoard(pos,testCheckBoard);
      //piece detection.  can't take a piece moving forward
    } else if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white'
    && newBoard[pos[0]][pos[1]].color === 'black' && ((this.state.moveFrom[0]-1 === pos[0] && this.state.moveFrom[1]-1 === pos[1])
    || (this.state.moveFrom[0]-1 === pos[0] && this.state.moveFrom[1]+1 === pos[1]))) {
      this.updateBoard(pos,testCheckBoard);
      if ((pos[0] === 0 || pos[0] === 7) && !testCheckBoard) {
        this.setState({showPieceSelectionModal: true});
      }
    } else if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black'
    && newBoard[pos[0]][pos[1]].color === 'white' && ((this.state.moveFrom[0]+1 === pos[0] && this.state.moveFrom[1]-1 === pos[1])
    || (this.state.moveFrom[0]+1 === pos[0] && this.state.moveFrom[1]+1 === pos[1]))) {
      if ((pos[0] === 0 || pos[0] === 7) && !testCheckBoard) {
        this.setState({showPieceSelectionModal: true});
      }
      this.updateBoard(pos,testCheckBoard);
    }
    if ((pos[0] === 0 || pos[0] === 7) && !testCheckBoard) {
      this.setState({switchPawn: [pos[0],pos[1]]});
    }
  }

  moveKight(pos,testCheckBoard) {
    //    console.log('knight');
    if ((pos[0] === this.state.moveFrom[0]-2 && pos[1]+1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-2 && pos[1]-1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-1 && pos[1]-2 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-1 && pos[1]+2 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+1 && pos[1]-2 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+1 && pos[1]+2 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+2 && pos[1]-1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+2 && pos[1]+1 === this.state.moveFrom[1])) {
      this.updateBoard(pos,testCheckBoard);
    }
  }

  moveRook(pos,testCheckBoard) {
    console.log('Rook');
    let newBoard;
    if (testCheckBoard) {
      newBoard = testCheckBoard;
    } else {
      newBoard = this.state.board.slice();
    }
    if (pos[0] === this.state.moveFrom[0] || pos[1] === this.state.moveFrom[1]) {
      let pieceBlocking = 0;

      if (pos[0] - this.state.moveFrom[0] > 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]+i][pos[1]].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] < 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]-i][pos[1]].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[1] - this.state.moveFrom[1] > 0) {
        for (let i=1; i < Math.abs(pos[1]-this.state.moveFrom[1]); i++) {
          if (newBoard[pos[0]][this.state.moveFrom[1]+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[1] - this.state.moveFrom[1] < 0) {
        for (let i=1; i < Math.abs(pos[1]-this.state.moveFrom[1]); i++) {
          if (newBoard[pos[0]][this.state.moveFrom[1]-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      }
      if (pieceBlocking === 0) {
        this.updateBoard(pos,testCheckBoard);
        console.log('inner');
        console.log(pieceBlocking);
      } else {
        pieceBlocking = 0;
      }
      console.log('outer');
    }
  }

  moveBishop(pos,testCheckBoard) {
    //    console.log('Bishop');
    let newBoard;
    if (testCheckBoard) {
      newBoard = testCheckBoard;
    } else {
      newBoard = this.state.board.slice();
    }
    let pieceBlocking = 0;
    if (pos[0] - this.state.moveFrom[0] === pos[1] - this.state.moveFrom[1] || pos[0] - this.state.moveFrom[0] === this.state.moveFrom[1]-pos[1]) {
      if (pos[0] - this.state.moveFrom[0] < 0 && pos[1] - this.state.moveFrom[1] < 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]-i][this.state.moveFrom[1]-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] < 0 && pos[1] - this.state.moveFrom[1] > 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]-i][this.state.moveFrom[1]+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] > 0 && pos[1] - this.state.moveFrom[1] < 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]+i][this.state.moveFrom[1]-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] > 0 && pos[1] - this.state.moveFrom[1] > 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]+i][this.state.moveFrom[1]+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      }
      if (pieceBlocking === 0) {
        this.updateBoard(pos,testCheckBoard);
      } else {
        pieceBlocking = 0;
      }
    }
  }

  moveQueen(pos,testCheckBoard) {
    //      console.log('Queen');
    let newBoard;
    if (testCheckBoard) {
      newBoard = testCheckBoard;
    } else {
      newBoard = this.state.board.slice();
    }
    let pieceBlocking = 0;
    if (pos[0] === this.state.moveFrom[0] || pos[1] === this.state.moveFrom[1] || pos[0] - this.state.moveFrom[0] === pos[1] - this.state.moveFrom[1] || pos[0] - this.state.moveFrom[0] === this.state.moveFrom[1]-pos[1]) {
      if (pos[0] - this.state.moveFrom[0] < 0 && pos[1] - this.state.moveFrom[1] < 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]-i][this.state.moveFrom[1]-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] < 0 && pos[1] - this.state.moveFrom[1] > 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]-i][this.state.moveFrom[1]+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] > 0 && pos[1] - this.state.moveFrom[1] < 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]+i][this.state.moveFrom[1]-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] > 0 && pos[1] - this.state.moveFrom[1] > 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]+i][this.state.moveFrom[1]+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] > 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]+i][pos[1]].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[0] - this.state.moveFrom[0] < 0) {
        for (let i=1; i < Math.abs(pos[0]-this.state.moveFrom[0]); i++) {
          if (newBoard[this.state.moveFrom[0]-i][pos[1]].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[1] - this.state.moveFrom[1] > 0) {
        for (let i=1; i < Math.abs(pos[1]-this.state.moveFrom[1]); i++) {
          if (newBoard[pos[0]][this.state.moveFrom[1]+i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      } else if (pos[1] - this.state.moveFrom[1] < 0) {
        for (let i=1; i < Math.abs(pos[1]-this.state.moveFrom[1]); i++) {
          if (newBoard[pos[0]][this.state.moveFrom[1]-i].occupied !== null) {
            pieceBlocking += 1;
          }
        }
      }
      if (pieceBlocking === 0) {
        this.updateBoard(pos,testCheckBoard);
      } else {
        pieceBlocking = 0;
      }
    }
  }

  updateWhiteKingPosDatabase(pos){
    if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
      let dbWhiteCastling = firebase.database().ref('whiteKingCastling');
      let dbWhitePosition = firebase.database().ref('whiteKingPos');
      dbWhiteCastling.set({whiteKing: true});
      dbWhitePosition.set({position: pos});
    }
  }
  updateBlackKingPosDatabase(pos){
    if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
      let dbBlackCastling = firebase.database().ref('blackKingCastling');
      let dbBlackPosition = firebase.database().ref('blackKingPos');
      dbBlackCastling.set({blackKing: true});
      dbBlackPosition.set({position: pos});
    }
  }

  moveKing(pos,testCheckBoard) {
    //    console.log('King');
    let newBoard;
    if (testCheckBoard) {
      newBoard = testCheckBoard;
    } else {
      newBoard = this.state.board.slice();
    }
    if ((pos[0] === this.state.moveFrom[0]+1 && pos[1]-1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+1 && pos[1] === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]+1 && pos[1]+1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0] && pos[1]-1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0] && pos[1]+1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-1 && pos[1]-1 === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-1 && pos[1] === this.state.moveFrom[1])
    || (pos[0] === this.state.moveFrom[0]-1 && pos[1]+1 === this.state.moveFrom[1])) {
      if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white') {
        if (!testCheckBoard) {
          this.setState({whiteKingMove: true, whiteKingPos: pos});
          if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
            this.updateWhiteKingPosDatabase(pos);
          }
        }
      } else if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black') {
        if (!testCheckBoard) {
          this.setState({blackKingMove: true, blackKingPos: pos});
          if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
            this.updateBlackKingPosDatabase(pos);
          }
        }
      }
      this.updateBoard(pos,testCheckBoard);
    } else if (this.state.whiteKingMove === false && pos[0] === this.state.moveFrom[0]
      && pos[1]-2 === this.state.moveFrom[1]
      && newBoard[pos[0]][pos[1]-1].occupied === null
      && newBoard[7][7].firstMove === true && newBoard[pos[0]][pos[1]-2].color === 'white') {
        newBoard[7][5] = newBoard[7][7];
        newBoard[7][5].positionY = 7;
        newBoard[7][5].positionX = 5;
        newBoard[7][7] = Object.assign({},this.state.emptyBoardPositionObj);
        newBoard[7][7].positionY = 7;
        newBoard[7][7].positionX = 7;
        if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
          newBoard[7][5].piece = 'rook';
          let dbMoveRook = firebase.database().ref('board/7/5');
          dbMoveRook.set(newBoard[7][5]);
          let dbMove = firebase.database().ref('board/7/7');
          dbMove.set(newBoard[7][7]);
        }
        if (newBoard[7][7].firstMove === true) {
          newBoard[7][5].firstMove = false;
        }
        if (!testCheckBoard) {
          this.setState({whiteKingMove: true, whiteKingPos: pos});
          this.updateWhiteKingPosDatabase(pos);
        }
        this.updateBoard(pos,testCheckBoard);
      } else if (this.state.whiteKingMove === false && pos[0] === this.state.moveFrom[0]
        && pos[1]+2 === this.state.moveFrom[1]
        && newBoard[pos[0]][pos[1]+1].occupied === null
        && newBoard[7][0].firstMove === true && newBoard[pos[0]][pos[1]-2].color === 'white') {
          newBoard[7][3] = newBoard[7][0];
          newBoard[7][3].positionY = 7;
          newBoard[7][3].positionX = 3;
          newBoard[7][0] = Object.assign({},this.state.emptyBoardPositionObj);
          newBoard[7][0].positionY = 0;
          newBoard[7][0].positionX = 0;
          if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
            newBoard[7][3].piece = 'rook';
            let dbMoveRook = firebase.database().ref('board/7/3');
            dbMoveRook.set(newBoard[7][3]);
            let dbMove = firebase.database().ref('board/7/0');
            dbMove.set(newBoard[7][0]);
          }
          if (newBoard[7][0].firstMove === true) {
            newBoard[7][3].firstMove = false;
          }
          if (!testCheckBoard) {
            this.setState({whiteKingMove: true, whiteKingPos: pos});
            this.updateWhiteKingPosDatabase(pos);
          }
          this.updateBoard(pos,testCheckBoard);
        }
        //// black
        else if (this.state.blackKingMove === false && pos[0] === this.state.moveFrom[0]
          && pos[1]-2 === this.state.moveFrom[1]
          && newBoard[pos[0]][pos[1]-1].occupied === null
          && newBoard[0][7].firstMove === true && newBoard[pos[0]][pos[1]-2].color === 'black') {
            newBoard[0][5] = newBoard[0][7];
            newBoard[0][5].positionY = 0;
            newBoard[0][5].positionX = 5;
            newBoard[0][7] = Object.assign({},this.state.emptyBoardPositionObj);
            newBoard[0][7].positionY = 0;
            newBoard[0][7].positionX = 7;
            if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
              newBoard[0][5].piece = 'rook';
              let dbMoveRook = firebase.database().ref('board/0/5');
              dbMoveRook.set(newBoard[0][5]);
              let dbMove = firebase.database().ref('board/0/7');
              dbMove.set(newBoard[0][7]);
            }
            if (newBoard[0][7].firstMove === true) {
              newBoard[0][5].firstMove = false;
            }
            if (!testCheckBoard) {
              this.setState({blackKingMove: true, blackKingPos: pos});
              this.updateBlackKingPosDatabase(pos);
            }
            this.updateBoard(pos,testCheckBoard);
          } else if (this.state.blackKingMove === false && pos[0] === this.state.moveFrom[0] && newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied === bk
            && pos[1]+2 === this.state.moveFrom[1]
            && newBoard[pos[0]][pos[1]-1].occupied === null
            && newBoard[pos[0]][pos[1]+1].occupied === null
            && newBoard[0][0].firstMove === true && newBoard[pos[0]][pos[1]+2].color === 'black') {
              newBoard[0][3] = newBoard[0][0];
              newBoard[0][3].positionY = 0;
              newBoard[0][3].positionX = 3;
              newBoard[0][0] = Object.assign({},this.state.emptyBoardPositionObj);
              newBoard[0][0].positionY = 0;
              newBoard[0][0].positionX = 0;
              if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
                newBoard[0][3].piece = 'rook';
                let dbMoveRook = firebase.database().ref('board/0/3');
                dbMoveRook.set(newBoard[0][3]);
                let dbMove = firebase.database().ref('board/0/0');
                dbMove.set(newBoard[0][0]);
              }
              if (newBoard[0][0].firstMove === true) {
                newBoard[0][3].firstMove = false;
              }
              if (!testCheckBoard) {
                this.setState({blackKingMove: true, blackKingPos: pos});
                this.updateBlackKingPosDatabase(pos);
              }
              this.updateBoard(pos,testCheckBoard);
            }
  }

  populateBoard() {
    let newBoard = this.state.board.slice();
    newBoard = [];

    let newWhitePiecesStaleMate = this.state.whitePiecesStaleMate.slice();
    let newBlackPiecesStaleMate = this.state.blackPiecesStaleMate.slice();
    let newSelectPieceWhite = this.state.selectPieceWhite.slice();
    let newSelectPieceBlack = this.state.selectPieceBlack.slice();
    let newTakenPiecesWhite = this.state.takenPiecesWhite.slice();
    let newTakenPiecesBlack = this.state.takenPiecesBlack.slice();
    let newPlayerTurn = this.state.playerTurn;

    let newMoveFrom = this.state.moveFrom.slice();
    let newSwitchPawn = this.state.switchPawn.slice();
    let newWhiteKingMove = this.state.whiteKingMove;
    let newBlackKingMove = this.state.blackKingMove;
    let newWhiteRookMoveOne = this.state.whiteRookMoveOne;
    let newWhiteRookMoveTwo = this.state.whiteRookMoveTwo;
    let newBlackRookMoveOne = this.state.blackRookMoveOne;
    let newBlackRookMoveTwo = this.state.blackRookMoveTwo;
    let newWhiteKingPos = this.state.whiteKingPos;
    let newBlackKingPos = this.state.blackKingPos;
    let newCheck = this.state.check;
    let newShowGameOverModal = this.state.showGameOverModal;
    let newGameOverBy = this.state.gameOverBy;
    let newClick = this.state.click;

    newWhitePiecesStaleMate = [];
    newBlackPiecesStaleMate = [];
    newSelectPieceWhite = [];
    newSelectPieceBlack = [];
    newTakenPiecesWhite = [];
    newTakenPiecesBlack = [];
    newPlayerTurn = 'white';

    newMoveFrom = [];
    newSwitchPawn = [];
    newWhiteKingMove = false;
    newBlackKingMove = false;
    newWhiteRookMoveOne = false;
    newWhiteRookMoveTwo = false;

    newBlackRookMoveOne = false;
    newBlackRookMoveTwo = false;
    newWhiteKingPos = [7,4];
    newBlackKingPos = [0,4];
    newCheck = null;
    newShowGameOverModal = false;
    '';
    newClick = 0;

    let y,x;
    let piecesToPopulateBoard = [{positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bp, piece: this.movePawn},
    {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wp, piece: this.movePawn},
    {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: br, piece: this.moveRook},
    {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wr, piece: this.moveRook},
    {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bkn, piece: this.moveKight},
    {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wkn, piece: this.moveKight},
    {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bb, piece: this.moveBishop},
    {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wb, piece: this.moveBishop},
    {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bq, piece: this.moveQueen},
    {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wq, piece: this.moveQueen},
    {positionY: y, positionX: x, color: 'black', highlight: null, firstMove: true, occupied: bk, piece: this.moveKing},
    {positionY: y, positionX: x, color: 'white', highlight: null, firstMove: true, occupied: wk, piece: this.moveKing}];

    let objectArr = [];

    for (let i = 0; i < 8; i++) {
      for (let a = 0; a < 8; a++) {
        // y = i;
        // x = a;
        if (i === 1) {

          let test1 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bp, piece: this.movePawn}, {});
          objectArr.push(test1);
          newBlackPiecesStaleMate.push(test1); //for determining stalemte

        } else if (i === 6) {
          let test1 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wp, piece: this.movePawn}, {});
          objectArr.push(test1);
          newWhitePiecesStaleMate.push(test1);

        } else if ((i === 0 && a === 0) || (i === 0 && a === 7)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: br, piece: this.moveRook}, {});
          objectArr.push(test2);
          newBlackPiecesStaleMate.push(test2);
        } else if ((i === 7 && a === 0) || (i === 7 && a === 7)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wr, piece: this.moveRook}, {});
          objectArr.push(test2);
          newWhitePiecesStaleMate.push(test2);

        } else if ((i === 0 && a === 1) || (i === 0 && a === 6)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bkn, piece: this.moveKight}, {});
          objectArr.push(test2);
          newBlackPiecesStaleMate.push(test2);
        } else if ((i === 7 && a === 1) || (i === 7 && a === 6)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wkn, piece: this.moveKight}, {});
          objectArr.push(test2);
          newWhitePiecesStaleMate.push(test2);

        } else if ((i === 0 && a === 2) || (i === 0 && a === 5)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bb, piece: this.moveBishop}, {});
          objectArr.push(test2);
          newBlackPiecesStaleMate.push(test2);
        } else if ((i === 7 && a === 2) || (i === 7 && a === 5)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wb, piece: this.moveBishop}, {});
          objectArr.push(test2);
          newWhitePiecesStaleMate.push(test2);

        } else if (i === 0 && a === 3) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bq, piece: this.moveQueen}, {});
          objectArr.push(test2);
          newBlackPiecesStaleMate.push(test2);
        } else if (i === 7 && a === 3) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wq, piece: this.moveQueen}, {});
          objectArr.push(test2);
          newWhitePiecesStaleMate.push(test2);

        } else if (i === 0 && a === 4) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', highlight: null, firstMove: true, occupied: bk, piece: this.moveKing}, {});
          objectArr.push(test2);
          newBlackPiecesStaleMate.push(test2);
        } else if (i === 7 && a === 4) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', highlight: null, firstMove: true, occupied: wk, piece: this.moveKing}, {});
          objectArr.push(test2);
          // newWhitePiecesStaleMate.push(test2);

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
    newSelectPieceWhite.push(Object.assign({},piecesToPopulateBoard[3]),Object.assign({},piecesToPopulateBoard[5]),Object.assign({},piecesToPopulateBoard[7]),Object.assign({},piecesToPopulateBoard[9]));
    newSelectPieceBlack.push(Object.assign({},piecesToPopulateBoard[2]),Object.assign({},piecesToPopulateBoard[4]),Object.assign({},piecesToPopulateBoard[6]),Object.assign({},piecesToPopulateBoard[8]));

    this.setState({board: newBoard,selectPieceWhite: newSelectPieceWhite,selectPieceBlack: newSelectPieceBlack,whitePiecesStaleMate: newWhitePiecesStaleMate,blackPiecesStaleMate: newBlackPiecesStaleMate,playerTurn: newPlayerTurn,moveFrom: newMoveFrom, switchPawn: newSwitchPawn, whiteKingMove: newWhiteKingMove, blackKingMove: newBlackKingMove, whiteRookMoveOne: newWhiteRookMoveOne, whiteRookMoveTwo: newWhiteRookMoveTwo, blackRookMoveOne: newBlackRookMoveOne, blackRookMoveTwo: newBlackRookMoveOne, blackRookMoveTwo: newBlackRookMoveTwo, whiteKingPos: newWhiteKingPos, blackKingPos: newBlackKingPos, check: newCheck, showGameOverModal: newShowGameOverModal,gameOverBy: newGameOverBy, takenPiecesWhite: newTakenPiecesWhite, takenPiecesBlack: newTakenPiecesBlack, click: newClick});
  }

  componentWillMount(){
    this.populateBoard();
    if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
      this.updateStateFromDatabase();
    }
  //  alert(screen.width)
  }
  componentDidMount() {
    document.title = 'Chess';
  }
  firebaseBoard(){
    this.populateBoard();
    console.log(this.props.match.params);
    let dbCheck = firebase.database().ref('check');
    dbCheck.set({check: ''});
    let clickDatabase = firebase.database().ref('click');
    clickDatabase.set({move: 0});
    let playerTurn = firebase.database().ref('playerTurn');
    playerTurn.set({turn:'white'});
    let dbWhiteCastling = firebase.database().ref('whiteKingCastling');
    dbWhiteCastling.set({whiteKing: false});
    let dbWhitePosition = firebase.database().ref('whiteKingPos');
    dbWhitePosition.set({position: [7,4]});
    let dbBlackCastling = firebase.database().ref('blackKingCastling');
    dbBlackCastling.set({blackKing: false});
    let dbBlackPosition = firebase.database().ref('blackKingPos');
    dbBlackPosition.set({position: [0,4]});
    let dbGameOver = firebase.database().ref('gameOverModal');
    dbGameOver.set({gameOver: false});
    let dbTakenPiecesWhite = firebase.database().ref('piecesTakenWhite');
    dbTakenPiecesWhite.set({piece: null});
    let dbTakenPiecesBlack = firebase.database().ref('piecesTakenBlack');
    dbTakenPiecesBlack.set({piece: null});

    function DatabasePiecePosition(positionY,positionX,color,highlight,firstMove,occupied,piece){
      this.positionY = positionY;
      this.positionX = positionX;
      this.color = color;
      this.highlight = highlight;
      this.firstMove = firstMove;
      this.occupied = occupied;
      this.piece = piece;
    }
    let row1 = firebase.database().ref('board/0');
    row1.set({
    0: new DatabasePiecePosition(0,0,'black',null,true,br,'rook'),
    1: new DatabasePiecePosition(0,1,'black',null,true,bkn,'knight'),
    2: new DatabasePiecePosition(0,2,'black',null,true,bb,'bishop'),
    3: new DatabasePiecePosition(0,3,'black',null,true,bq,'queen'),
    4: new DatabasePiecePosition(0,4,'black',null,true,bk,'king'),
    5: new DatabasePiecePosition(0,5,'black',null,true,bb,'bishop'),
    6: new DatabasePiecePosition(0,6,'black',null,true,bkn,'knight'),
    7: new DatabasePiecePosition(0,7,'black',null,true,br,'rook')
    });
    ///
    let row2 = firebase.database().ref('board/1');
    let row2Empty = {};
    for (let i=0; i < 8; i++) {
      row2Empty[i] = new DatabasePiecePosition(1,i,'black',null,true,bp,'pawn');
    }
    row2.set(row2Empty);
    ///
    let row3 = firebase.database().ref('board/2');
    let row3Empty = {};
    for (let i=0; i < 8; i++) {
      row3Empty[i] = new DatabasePiecePosition(2,i,false,null,false,false,false);
    }
    row3.set(row3Empty);
    ///
    let row4 = firebase.database().ref('board/3');
    let row4Empty = {};
    for (let i=0; i < 8; i++) {
      row4Empty[i] = new DatabasePiecePosition(3,i,false,null,false,false,false);
    }
    row4.set(row4Empty);
    ///
    let row5 = firebase.database().ref('board/4');
    let row5Empty = {};
    for (let i=0; i < 8; i++) {
      row5Empty[i] = new DatabasePiecePosition(4,i,false,null,false,false,false);
    }
    row5.set(row5Empty);
    ///
    let row6 = firebase.database().ref('board/5');
    let row6Empty = {};
    for (let i=0; i < 8; i++) {
      row6Empty[i] = new DatabasePiecePosition(5,i,false,null,false,false,false);
    }
    row6.set(row6Empty);
    ///
    let row7 = firebase.database().ref('board/6');
    let row7Empty = {};
    for (let i=0; i < 8; i++) {
      row7Empty[i] = new DatabasePiecePosition(6,i,'white',null,true,wp,'pawn');
    }
    row7.set(row7Empty);
    ///
    let row8 = firebase.database().ref('board/7');
    row8.set({
    0: new DatabasePiecePosition(7,0,'white',null,true,wr,'rook'),
    1: new DatabasePiecePosition(7,1,'white',null,true,wkn,'knight'),
    2: new DatabasePiecePosition(7,2,'white',null,true,wb,'bishop'),
    3: new DatabasePiecePosition(7,3,'white',null,true,wq,'queen'),
    4: new DatabasePiecePosition(7,4,'white',null,true,wk,'king'),
    5: new DatabasePiecePosition(7,5,'white',null,true,wb,'bishop'),
    6: new DatabasePiecePosition(7,6,'white',null,true,wkn,'knight'),
    7: new DatabasePiecePosition(7,7,'white',null,true,wr,'rook')
    });

    }

  updateBoardFromDatabase(boardDatabase){
  let newBoard = [];
  let objectArr = [];
    for (let position in boardDatabase) {
      for (let i=0; i < 8; i++) {
      if (boardDatabase[position][i].piece === 'pawn') {
        boardDatabase[position][i].piece = this.movePawn;
      } else if (boardDatabase[position][i].piece === 'knight') {
        boardDatabase[position][i].piece = this.moveKight;
      } else if (boardDatabase[position][i].piece === 'rook') {
        boardDatabase[position][i].piece = this.moveRook;
      } else if (boardDatabase[position][i].piece === 'bishop') {
        boardDatabase[position][i].piece = this.moveBishop;
      } else if (boardDatabase[position][i].piece === 'queen') {
        boardDatabase[position][i].piece = this.moveQueen;
      } else if (boardDatabase[position][i].piece === 'king') {
        boardDatabase[position][i].piece = this.moveKing;
      } else {
    //    boardDatabase[position][i].piece = null;
      }
      if (!boardDatabase[position][i].occupied) {
        boardDatabase[position][i].occupied = null;
      }

      objectArr.push(Object.assign({},boardDatabase[position][i]));
      if (i === 7) {
        newBoard.push(objectArr);
        objectArr = [];
      }

    }
  }
      console.log(boardDatabase);
  //  });
      this.setState({board: newBoard});
  }
  updateDatabase(pos) {
    //alert("pos" + pos + " - " + this.state.moveFrom);
    let pieceMovement = this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].piece;
    let pieceMovementArr = [this.movePawn,this.moveKight,this.moveRook,this.moveBishop,this.moveQueen,this.moveKing];
    let newPiece;
    let pieceMovementPlaceholder = ['pawn','knight','rook','bishop','queen','king'];
    for (let i=0; i < 6; i++) {
      if (pieceMovement === pieceMovementArr[i]) {
        newPiece = pieceMovementPlaceholder[i];
      }
    }
    let dbMoveTo = firebase.database().ref('board/'+pos[0]+'/'+pos[1]);
    dbMoveTo.set({
      positionY: pos[0],
      positionX: pos[1],
      color: this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color,
      highlight: null,
      firstMove: false,
      occupied: this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied,
      piece: newPiece
    });
    let dbMoveFrom = firebase.database().ref('board/'+this.state.moveFrom[0]+'/'+this.state.moveFrom[1]);
    dbMoveFrom.set({
      positionY: this.state.moveFrom[0],
      positionX: this.state.moveFrom[1],
      color: false,
      highlight: null,
      firstMove: false,
      occupied: false,
      piece: false
    });
  }


  movePiece(pos,testCheckBoard){
    let playerURL;
    if (this.props.match.params.handle === 'playerOne') {
      playerURL = 'white';
    } else if (this.props.match.params.handle === 'playerTwo') {
      playerURL = 'black';
    } else {
      playerURL = this.state.playerTurn;
    }

    let isGameOver = [];
    let isGameOverCanKingMove = [];
    let color;
    let newBoard = this.state.board.slice();

    if (this.state.click === 0 && this.state.board[pos[0]][pos[1]].color === this.state.playerTurn && this.state.playerTurn === playerURL) {
      if (this.state.board[pos[0]][pos[1]].occupied !== null) {
        let newBoard = this.state.board.slice();
        newBoard[pos[0]][pos[1]].highlight = Object.assign({border: 'solid', borderWidth: 'thick', borderColor: 'red'}, {});

        if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
          let clickDatabase = firebase.database().ref('click');
          clickDatabase.set({move: 1});
        } else {
          this.setState({click: 1});
        }

        // clickDatabase.on('value',(snapshot)=> {
        // let clickDatabase = snapshot.val();
        //   this.setState({click: clickDatabase.move});
        // });

        this.setState({moveFrom: [pos[0],pos[1]]});
      }
    }
    if (this.state.moveFrom.length !== 0 && this.state.click === 1 && this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color === this.state.playerTurn && this.state.playerTurn === playerURL) {
      if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color !== this.state.board[pos[0]][pos[1]].color) {
        let testCheckBoard =[];
        //run move on a test board to see if move is legal
        this.mustMoveOutOfCheck(pos,testCheckBoard);
        if (testCheckBoard.length === 0) {
          if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white') {
            color = 2;
          } else if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black') {
            color = 1;
          }
          this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].piece(pos);
        }
      } else if (!newBoard[pos[0]][pos[1]].highlight) {
        newBoard[pos[0]][pos[1]].highlight = Object.assign({border: 'solid',borderWidth: 'thick',borderColor: 'red'}, {});
        newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].highlight = null;
        this.setState({moveFrom: [pos[0],pos[1]]});
        this.setState({board: newBoard});
      }
    }
    console.log(this.state.board);
    this.inCheck(pos,color,isGameOver,isGameOverCanKingMove);
    if (isGameOver.length > 0 && isGameOverCanKingMove.length === 0) {
      //    alert('is game over : ' + isGameOver);
      if (this.props.match.params.handle === 'playerOne' || this.props.match.params.handle === 'playerTwo') {
        let dbModal = firebase.database().ref('gameOverModal');
        dbModal.set({gameOver: true});
        let dbGameOver = firebase.database().ref('gameOverBy');
        dbGameOver.set({gameOver: 'Checkmate'});
      }
      this.setState({showGameOverModal: true, gameOverBy: 'Checkmate'});
    }
  }

  mustMoveOutOfCheck(pos,testCheckBoard) {
    // create clone of this.state.board
    let newBoard = [];
    let objectArr = [];
    for (let i = 0; i < 8; i++) {
      for (let a = 0; a < 8; a++) {
        if (this.state.board[i][a].occupied) {
          objectArr.push(Object.assign({},this.state.board[i][a]));
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
    let color;
    let king;
    let kingPosY;
    let kingPosX;
    if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'black') {
      color = 2;
      king = bk;
    } else if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color === 'white') {
      color = 1;
      king = wk;
    }
    if (newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied === king) {
      //alert("bk");
      kingPosY = pos[0];
      kingPosX = pos[1];
    } else {
      if (color === 2) {
        kingPosY = this.state.blackKingPos[0];
        kingPosX = this.state.blackKingPos[1];
      } else {
        kingPosY = this.state.whiteKingPos[0];
        kingPosX= this.state.whiteKingPos[1];
      }
    }
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].piece(pos,newBoard);
    this.checkmateTakeWithPawn(color,kingPosY,kingPosX,testCheckBoard,newBoard);
    this.checkByKnight(pos,color,false,kingPosY,kingPosX,testCheckBoard,newBoard);
    this.checkByBishop(pos,color,false,kingPosY,kingPosX,testCheckBoard,null,newBoard);
    this.checkByRook(pos,color,false,kingPosY,kingPosX,testCheckBoard,null,newBoard);
  }
  testForStalemate(pos,color,isStatemate) {
    let newBoard = this.state.board.slice();
    let stalemate,rook,bishop,queen,knight,pawn;
    if (color === 2) {
      stalemate = this.state.blackPiecesStaleMate;
      rook = br;
      bishop = bb;
      queen = bq;
      knight = bkn;
      pawn = bp;
    } else {
      stalemate = this.state.whitePiecesStaleMate;
      rook = wr;
      bishop = wb;
      queen = wq;
      knight = wkn;
      pawn = wp;
    }
    console.log('stalemate',stalemate);

    for (let i=0; i<stalemate.length; i++){
      if (stalemate[i].occupied === rook || stalemate[i].occupied === queen) {
        if (stalemate[i].positionY-1 >=0 && (!newBoard[stalemate[i].positionY-1][stalemate[i].positionX].occupied || newBoard[stalemate[i].positionY-1][stalemate[i].positionX].color !== stalemate[i].color)){
          isStatemate.push('top');
        }
        if (stalemate[i].positionY+1 <=7 && (!newBoard[stalemate[i].positionY+1][stalemate[i].positionX].occupied || newBoard[stalemate[i].positionY+1][stalemate[i].positionX].color !== stalemate[i].color)){
          isStatemate.push('bottom');
        }
        if (stalemate[i].positionX-1 >=0 && (!newBoard[stalemate[i].positionY][stalemate[i].positionX-1].occupied || newBoard[stalemate[i].positionY][stalemate[i].positionX-1].color !== stalemate[i].color)){
          isStatemate.push('left');
        }
        if (stalemate[i].positionX+1 <=7 && (!newBoard[stalemate[i].positionY][stalemate[i].positionX+1].occupied || newBoard[stalemate[i].positionY][stalemate[i].positionX+1].color !== stalemate[i].color)){
          isStatemate.push('right');
        }
      }
       if (stalemate[i].occupied === bishop || stalemate[i].occupied === queen) {
        if (stalemate[i].positionY-1 >=0 && stalemate[i].positionX-1 >=0 && (!newBoard[stalemate[i].positionY-1][stalemate[i].positionX-1].occupied || newBoard[stalemate[i].positionY-1][stalemate[i].positionX-1].color !== stalemate[i].color)) {
          isStatemate.push('topLeft');
        }
        if (stalemate[i].positionY-1 >=0 && stalemate[i].positionX+1 <=7 && (!newBoard[stalemate[i].positionY-1][stalemate[i].positionX+1].occupied || newBoard[stalemate[i].positionY-1][stalemate[i].positionX+1].color !== stalemate[i].color)) {
          isStatemate.push('topRight');
        }
        if (stalemate[i].positionY+1 <=7 && stalemate[i].positionX-1 >=0 && (!newBoard[stalemate[i].positionY+1][stalemate[i].positionX-1].occupied || newBoard[stalemate[i].positionY+1][stalemate[i].positionX-1].color !== stalemate[i].color)) {
          isStatemate.push('bottomLeft');
        }
        if (stalemate[i].positionY+1 <=7 && stalemate[i].positionX+1 <=7 && (!newBoard[stalemate[i].positionY+1][stalemate[i].positionX+1].occupied || newBoard[stalemate[i].positionY+1][stalemate[i].positionX+1].color !== stalemate[i].color)) {
          isStatemate.push('bottomRight');
        }
      }
      if (stalemate[i].occupied === knight) {
      if ((stalemate[i].positionY-2 >=0 && stalemate[i].positionX-1 >=0 && (!newBoard[stalemate[i].positionY-2][stalemate[i].positionX-1].occupied || newBoard[stalemate[i].positionY-2][stalemate[i].positionX-1].color !== stalemate[i].color))
      || (stalemate[i].positionY-2 >=0 && stalemate[i].positionX+1 <=7 && (!newBoard[stalemate[i].positionY-2][stalemate[i].positionX+1].occupied || newBoard[stalemate[i].positionY-2][stalemate[i].positionX+1].color !== stalemate[i].color))
      || (stalemate[i].positionY-1 >=0 && stalemate[i].positionX-2 >=0 && (!newBoard[stalemate[i].positionY-1][stalemate[i].positionX-2].occupied || newBoard[stalemate[i].positionY-1][stalemate[i].positionX-2].color !== stalemate[i].color))
      || (stalemate[i].positionY-1 >=0 && stalemate[i].positionX+2 <=7 && (!newBoard[stalemate[i].positionY-1][stalemate[i].positionX+2].occupied || newBoard[stalemate[i].positionY-1][stalemate[i].positionX+2].color !== stalemate[i].color))
      || (stalemate[i].positionY+1 <=7 && stalemate[i].positionX-2 >=0 && (!newBoard[stalemate[i].positionY+1][stalemate[i].positionX-2].occupied || newBoard[stalemate[i].positionY+1][stalemate[i].positionX-2].color !== stalemate[i].color))
      || (stalemate[i].positionY+1 <=7 && stalemate[i].positionX+2 <=7 && (!newBoard[stalemate[i].positionY+1][stalemate[i].positionX+2].occupied || newBoard[stalemate[i].positionY+1][stalemate[i].positionX+2].color !== stalemate[i].color))
      || (stalemate[i].positionY+2 <=7 && stalemate[i].positionX-1 >=0 && (!newBoard[stalemate[i].positionY+2][stalemate[i].positionX-1].occupied || newBoard[stalemate[i].positionY+2][stalemate[i].positionX-1].color !== stalemate[i].color))
      || (stalemate[i].positionY+2 <=7 && stalemate[i].positionX+1 <=7 && (!newBoard[stalemate[i].positionY+2][stalemate[i].positionX+1].occupied || newBoard[stalemate[i].positionY+2][stalemate[i].positionX+1].color !== stalemate[i].color))
      ) {
        isStatemate.push('kight');
      }
    }
    if (stalemate[i].occupied === pawn) {
      if (color === 2) {
        if (stalemate[i].positionY+1 <=7 && !newBoard[stalemate[i].positionY+1][stalemate[i].positionX].occupied) {
          isStatemate.push('pawn');
        }
        if (stalemate[i].positionY+1 <=7 && stalemate[i].positionX+1 <=7 && newBoard[stalemate[i].positionY+1][stalemate[i].positionX+1].occupied && newBoard[stalemate[i].positionY+1][stalemate[i].positionX+1].color !== stalemate[i].color) {
          isStatemate.push('pawnRight');
        }
        if (stalemate[i].positionY+1 <=7 && stalemate[i].positionX-1 >=0 && newBoard[stalemate[i].positionY+1][stalemate[i].positionX-1].occupied && newBoard[stalemate[i].positionY+1][stalemate[i].positionX-1].color !== stalemate[i].color) {
          isStatemate.push('pawnLeft');
        }
      }
      if (color === 1) {
        if (stalemate[i].positionY-1 >=0 && !newBoard[stalemate[i].positionY-1][stalemate[i].positionX].occupied) {
          isStatemate.push('pawn');
        }
        if (stalemate[i].positionY-1 >=0 && stalemate[i].positionX+1 <=7 && newBoard[stalemate[i].positionY-1][stalemate[i].positionX+1].occupied && newBoard[stalemate[i].positionY-1][stalemate[i].positionX+1].color !== stalemate[i].color) {
          isStatemate.push('pawnRight');
        }
        if (stalemate[i].positionY-1 >=0 && stalemate[i].positionX-1 >=0 && newBoard[stalemate[i].positionY-1][stalemate[i].positionX-1].occupied && newBoard[stalemate[i].positionY-1][stalemate[i].positionX-1].color !== stalemate[i].color) {
          isStatemate.push('pawnLeft');
        }
      }
    }
    }
  }

  closeHowToPlayModal(){
    this.setState({howToPlayModal: false});
  }
  openHowToPlayModal(){
    this.setState({howToPlayModal: true});
  }

  closeOnlinePlayModal(){
    this.setState({onlinePlayModal: false});
  }
  openOnlinePlayModal(){
    this.setState({onlinePlayModal: true});
  }

  closeAboutModal(){
    this.setState({aboutModal: false});
  }
  openAboutModal(){
    this.setState({aboutModal: true});
  }

  render(){
    let main;
    if (screen.width < 450) {
      main = {
        width: '100%',
        padding: 15,
        // marginRight: 'auto',
        // marginLeft: 'auto',
        backgroundColor: 'white',
        backgroundColor: 'rgba(255,255,255,0.6)',
        height: 1225
      };
    } else {
      main = {
        width: 600,
        padding: 15,
        marginRight: 'auto',
        marginLeft: 'auto',
        backgroundColor: 'white',
        backgroundColor: 'rgba(255,255,255,0.5)',
      };
    }
    const aboutMe = {
      backgroundColor: 'white',
      color: 'black',
      border: '2px solid #555555',
      height: 40,
      width: '100%'
    };
    const moveAboutMe = {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 200
    };
    return (
      <div style={main}>
      <ChessBoard movePiece={this.movePiece} check={this.state.check} board={this.state.board} playerTurn={this.state.playerTurn} handle={this.props.match.params.handle} handle={this.props.match.params.handle} populateBoard={this.populateBoard}
      firebaseBoard={this.firebaseBoard} howToPlayModal={this.state.howToPlayModal} openHowToPlayModal={this.openHowToPlayModal}
      updateStateFromDatabase={this.updateStateFromDatabase} openOnlinePlayModal={this.openOnlinePlayModal} handle={this.props.match.params.handle}/>

      <PiecesTaken takenPiecesWhite={this.state.takenPiecesWhite} takenPiecesBlack={this.state.takenPiecesBlack} handle={this.props.match.params.handle}/>

      <PiecesToSelect selectTakenPiece={this.selectTakenPiece} selectPieceWhite={this.state.selectPieceWhite} selectPieceBlack={this.state.selectPieceBlack}
      switchPawn={this.state.switchPawn} showPieceSelectionModal={this.state.showPieceSelectionModal}/>
      <GameOver showGameOverModal={this.state.showGameOverModal} populateBoard={this.populateBoard} firebaseBoard={this.firebaseBoard} gameOverBy={this.state.gameOverBy} handle={this.props.match.params.handle}/>

      <HowToPlay closeHowToPlayModal={this.closeHowToPlayModal} howToPlayModal={this.state.howToPlayModal}/>

      <OnlinePlayModal onlinePlayModal={this.state.onlinePlayModal} closeOnlinePlayModal={this.closeOnlinePlayModal}
      updateStateFromDatabase={this.updateStateFromDatabase}/>
      <div style={moveAboutMe}>
        <button style={aboutMe} onClick={()=>this.openAboutModal()}>About Me</button>
      </div>
      <AboutModal closeAboutModal={this.closeAboutModal} aboutModal={this.state.aboutModal}/>
      <br/>
      </div>
    );
  }

}
// App.propTypes = {
//   populateBoard: PropTypes.func
// };

export default MainBoard;
