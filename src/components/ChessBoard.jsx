import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ChessBoard(props){

  const squareColor = {
    backgroundColor: '#ADD8E6'
  };
  const whiteback = {
    backgroundColor: 'white'
  };
  const showTurn = {
    fontSize: '30px'
  };
  const showCheck = {
    fontSize: 'none',
    float: 'none',
    textShadow: '1px 1px red'
  };
  let rotateImages;
    if (props.handle === 'playerTwo') {
      rotateImages = {
        msTransform: 'rotate(180deg)',
        WebkitTransform: 'rotate(180deg)',
        transform: 'rotate(180deg)',
        marginRight: 'auto',
        marginLeft: 'auto'
      };
    } else {
      //rotateImages = null;
      rotateImages = {
        marginRight: 'auto',
        marginLeft: 'auto'
      };
    }
    let mainNavbar = {
      borderStyle: 'solid',
      borderWidth: 5
    };
    let buttons = {
    //  width: '95%',
      marginLeft: 'auto',
      marginRight: 'auto',
    };

    let player;
    if (props.handle === 'playerOne') {
      player = 'Player 1';
    } else if (props.handle === 'playerTwo') {
      player = 'Player 2';
    } else {
      player = 'Local Play';
    }

    let restartButton;
    let navButtons;
    let onlinePlay;
    if (props.handle === 'playerOne' || props.handle === 'playerTwo') {
      restartButton = <button style={navButtons} onClick={()=>props.firebaseBoard()}>Start New Online Play</button>;
      if (screen.width < 450) {
      navButtons = {
        width: '23.40%'
      };
    } else {
      navButtons = {
      width: '23.02%'
      };
    }
      onlinePlay = 'Online Play';
    } else {
      restartButton = <button style={navButtons} onClick={()=>props.populateBoard()}>Start New Local Play</button>;
      if (screen.width < 450) {
        navButtons = {
          width: '23.73%'
        };
      } else {
      navButtons = {
        width: '23.49%'
      };
    }


      onlinePlay = null;
    }
    let currentTurn;
    if (props.playerTurn === 'white') {
      currentTurn = 'Player 1 (White)';
    } else if (props.playerTurn === 'black'){
      currentTurn = 'Player 2 (Black)';
    }

  return(
    <div>
    <style jsx>{`
      td {
        border-style: solid;
        width: 70px;
        height: 70px;
      }
      img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 92%;
      }
      h1 {
        font-size: 60px;
      }
      span {
        float: right;
      }

      `}</style>
      <div>
      <h1>{player} <span>{onlinePlay}</span></h1>
      </div>

      <div style={mainNavbar}>
      <div style={buttons}>
      <button style={navButtons} onClick={()=>props.openHowToPlayModal()}>How To Play</button>
      <Link to={'/'} onClick={()=>props.populateBoard()}><button style={navButtons}>Local Play</button></Link>
      <button style={navButtons} onClick={()=>props.openOnlinePlayModal()}>Online Play</button>
      <span>{restartButton}</span>
      </div>
      </div>
      <p style={showTurn}>Turn: {currentTurn}</p>
      <p style={showTurn}>Check: <span style={showCheck}>{props.check}</span></p>


      <table style={rotateImages}>

      <tbody style={whiteback}>
      <tr className="row1">

      <td style={props.board[0][0].highlight} onClick={()=>props.movePiece([0,0])}><img src={props.board[0][0].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[0][1].highlight)} onClick={()=>props.movePiece([0,1])}><img src={props.board[0][1].occupied} style={rotateImages}/></td>
      <td style={props.board[0][2].highlight} onClick={()=>props.movePiece([0,2])}><img src={props.board[0][2].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[0][3].highlight)} onClick={()=>props.movePiece([0,3])}><img src={props.board[0][3].occupied} style={rotateImages}/></td>
      <td style={props.board[0][4].highlight} onClick={()=>props.movePiece([0,4])}><img src={props.board[0][4].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[0][5].highlight)} onClick={()=>props.movePiece([0,5])}><img src={props.board[0][5].occupied} style={rotateImages}/></td>
      <td style={props.board[0][6].highlight} onClick={()=>props.movePiece([0,6])}><img src={props.board[0][6].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[0][7].highlight)} onClick={()=>props.movePiece([0,7])}><img src={props.board[0][7].occupied} style={rotateImages}/></td>
      </tr>
      <tr className="row2">
      <td style={Object.assign({}, squareColor, props.board[1][0].highlight)} onClick={()=>props.movePiece([1,0])}><img src={props.board[1][0].occupied} style={rotateImages}/></td>
      <td style={props.board[1][1].highlight} onClick={()=>props.movePiece([1,1])}><img src={props.board[1][1].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[1][2].highlight)} onClick={()=>props.movePiece([1,2])}><img src={props.board[1][2].occupied} style={rotateImages}/></td>
      <td style={props.board[1][3].highlight} onClick={()=>props.movePiece([1,3])}><img src={props.board[1][3].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[1][4].highlight)} onClick={()=>props.movePiece([1,4])}><img src={props.board[1][4].occupied} style={rotateImages}/></td>
      <td style={props.board[1][5].highlight} onClick={()=>props.movePiece([1,5])}><img src={props.board[1][5].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[1][6].highlight)} onClick={()=>props.movePiece([1,6])}><img src={props.board[1][6].occupied} style={rotateImages}/></td>
      <td style={props.board[1][7].highlight} onClick={()=>props.movePiece([1,7])}><img src={props.board[1][7].occupied} style={rotateImages}/></td>
      </tr>
      <tr className="row3">
      <td style={props.board[2][0].highlight} onClick={()=>props.movePiece([2,0])}><img src={props.board[2][0].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[2][1].highlight)} onClick={()=>props.movePiece([2,1])}><img src={props.board[2][1].occupied} style={rotateImages}/></td>
      <td style={props.board[2][2].highlight} onClick={()=>props.movePiece([2,2])}><img src={props.board[2][2].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[2][3].highlight)} onClick={()=>props.movePiece([2,3])}><img src={props.board[2][3].occupied} style={rotateImages}/></td>
      <td style={props.board[2][4].highlight} onClick={()=>props.movePiece([2,4])}><img src={props.board[2][4].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[2][5].highlight)} onClick={()=>props.movePiece([2,5])}><img src={props.board[2][5].occupied} style={rotateImages}/></td>
      <td style={props.board[2][6].highlight} onClick={()=>props.movePiece([2,6])}><img src={props.board[2][6].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[2][7].highlight)} onClick={()=>props.movePiece([2,7])}><img src={props.board[2][7].occupied} style={rotateImages}/></td>
      </tr>
      <tr className="row4">
      <td style={Object.assign({}, squareColor, props.board[3][0].highlight)} onClick={()=>props.movePiece([3,0])}><img src={props.board[3][0].occupied} style={rotateImages}/></td>
      <td style={props.board[3][1].highlight} onClick={()=>props.movePiece([3,1])}><img src={props.board[3][1].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[3][2].highlight)} onClick={()=>props.movePiece([3,2])}><img src={props.board[3][2].occupied} style={rotateImages}/></td>
      <td style={props.board[3][3].highlight} onClick={()=>props.movePiece([3,3])}><img src={props.board[3][3].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[3][4].highlight)} onClick={()=>props.movePiece([3,4])}><img src={props.board[3][4].occupied} style={rotateImages}/></td>
      <td style={props.board[3][5].highlight} onClick={()=>props.movePiece([3,5])}><img src={props.board[3][5].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[3][6].highlight)} onClick={()=>props.movePiece([3,6])}><img src={props.board[3][6].occupied} style={rotateImages}/></td>
      <td style={props.board[3][7].highlight} onClick={()=>props.movePiece([3,7])}><img src={props.board[3][7].occupied} style={rotateImages}/></td>
      </tr>
      <tr className="row5">
      <td style={props.board[4][0].highlight} onClick={()=>props.movePiece([4,0])}><img src={props.board[4][0].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[4][1].highlight)} onClick={()=>props.movePiece([4,1])}><img src={props.board[4][1].occupied} style={rotateImages}/></td>
      <td style={props.board[4][2].highlight} onClick={()=>props.movePiece([4,2])}><img src={props.board[4][2].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[4][3].highlight)} onClick={()=>props.movePiece([4,3])}><img src={props.board[4][3].occupied} style={rotateImages}/></td>
      <td style={props.board[4][4].highlight} onClick={()=>props.movePiece([4,4])}><img src={props.board[4][4].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[4][5].highlight)} onClick={()=>props.movePiece([4,5])}><img src={props.board[4][5].occupied} style={rotateImages}/></td>
      <td style={props.board[4][6].highlight} onClick={()=>props.movePiece([4,6])}><img src={props.board[4][6].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[4][7].highlight)} onClick={()=>props.movePiece([4,7])}><img src={props.board[4][7].occupied} style={rotateImages}/></td>
      </tr>
      <tr className="row6">
      <td style={Object.assign({}, squareColor, props.board[5][0].highlight)} onClick={()=>props.movePiece([5,0])}><img src={props.board[5][0].occupied} style={rotateImages}/></td>
      <td style={props.board[5][1].highlight} onClick={()=>props.movePiece([5,1])}><img src={props.board[5][1].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[5][2].highlight)} onClick={()=>props.movePiece([5,2])}><img src={props.board[5][2].occupied} style={rotateImages}/></td>
      <td style={props.board[5][3].highlight} onClick={()=>props.movePiece([5,3])}><img src={props.board[5][3].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[5][4].highlight)} onClick={()=>props.movePiece([5,4])}><img src={props.board[5][4].occupied} style={rotateImages}/></td>
      <td style={props.board[5][5].highlight} onClick={()=>props.movePiece([5,5])}><img src={props.board[5][5].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[5][6].highlight)} onClick={()=>props.movePiece([5,6])}><img src={props.board[5][6].occupied} style={rotateImages}/></td>
      <td style={props.board[5][7].highlight} onClick={()=>props.movePiece([5,7])}><img src={props.board[5][7].occupied} style={rotateImages}/></td>
      </tr>
      <tr className="row7">
      <td style={props.board[6][0].highlight} onClick={()=>props.movePiece([6,0])}><img src={props.board[6][0].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[6][1].highlight)} onClick={()=>props.movePiece([6,1])}><img src={props.board[6][1].occupied} style={rotateImages}/></td>
      <td style={props.board[6][2].highlight} onClick={()=>props.movePiece([6,2])}><img src={props.board[6][2].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[6][3].highlight)} onClick={()=>props.movePiece([6,3])}><img src={props.board[6][3].occupied} style={rotateImages}/></td>
      <td style={props.board[6][4].highlight} onClick={()=>props.movePiece([6,4])}><img src={props.board[6][4].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[6][5].highlight)} onClick={()=>props.movePiece([6,5])}><img src={props.board[6][5].occupied} style={rotateImages}/></td>
      <td style={props.board[6][6].highlight} onClick={()=>props.movePiece([6,6])}><img src={props.board[6][6].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[6][7].highlight)} onClick={()=>props.movePiece([6,7])}><img src={props.board[6][7].occupied} style={rotateImages}/></td>
      </tr>
      <tr className="row8">
      <td style={Object.assign({}, squareColor, props.board[7][0].highlight)} onClick={()=>props.movePiece([7,0])}><img src={props.board[7][0].occupied} style={rotateImages}/></td>
      <td style={props.board[7][1].highlight} onClick={()=>props.movePiece([7,1])}><img src={props.board[7][1].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[7][2].highlight)} onClick={()=>props.movePiece([7,2])}><img src={props.board[7][2].occupied} style={rotateImages}/></td>
      <td style={props.board[7][3].highlight} onClick={()=>props.movePiece([7,3])}><img src={props.board[7][3].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[7][4].highlight)} onClick={()=>props.movePiece([7,4])}><img src={props.board[7][4].occupied} style={rotateImages}/></td>
      <td style={props.board[7][5].highlight} onClick={()=>props.movePiece([7,5])}><img src={props.board[7][5].occupied} style={rotateImages}/></td>
      <td style={Object.assign({}, squareColor, props.board[7][6].highlight)} onClick={()=>props.movePiece([7,6])}><img src={props.board[7][6].occupied} style={rotateImages}/></td>
      <td style={props.board[7][7].highlight} onClick={()=>props.movePiece([7,7])}><img src={props.board[7][7].occupied} style={rotateImages}/></td>
      </tr>
      </tbody>
      </table>

      </div>

  );
}

ChessBoard.propTypes = {

};
export default ChessBoard;
