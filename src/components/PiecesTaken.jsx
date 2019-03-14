import React from 'react';
import PropTypes from 'prop-types';

function PiecesTaken(props){
  let whitePiecesTaken = [];
  let blackPiecesTaken = [];


  if (props.handle === 'playerOne' || props.handle === 'playerTwo') {

    let dbTakenPiecesWhite = firebase.database().ref('piecesTakenWhite');
    dbTakenPiecesWhite.on('value',(snapshot)=> {
    let takenPieces = snapshot.val()
    for (let piece in takenPieces) {
      whitePiecesTaken.push(<img src={takenPieces[piece].piece.occupied} key={piece}/>);
    }
    });

    let dbTakenPiecesBlack = firebase.database().ref('piecesTakenBlack');
    dbTakenPiecesBlack.on('value',(snapshot)=> {
    let takenPieces = snapshot.val()
    for (let piece in takenPieces) {
      blackPiecesTaken.push(<img src={takenPieces[piece].piece.occupied} key={piece}/>);
    }
    });

  } else {
    for (let i=0; i < props.takenPiecesWhite.length; i ++) {
      whitePiecesTaken.push(<img src={props.takenPiecesWhite[i].occupied} key={i}/>);
    }
    for (let i=0; i < props.takenPiecesBlack.length; i ++) {
      blackPiecesTaken.push(<img src={props.takenPiecesBlack[i].occupied} key={i}/>);
    }
  }
  const top = {
    marginTop: '10px'
  }

  return(
    <div style={top}>
    <h3>Pieces Taken</h3>
      <p>White: {whitePiecesTaken}</p>
      <p>Black: {blackPiecesTaken}</p>
    </div>
  );
}

PiecesTaken.propTypes = {
  whitePiecesTaken: PropTypes.element,
  blackPiecesTaken: PropTypes.element
};
export default PiecesTaken;
