import React from 'react';
import PropTypes from 'prop-types';

function PiecesTaken(props){
  let whitePiecesTaken = [];
  let blackPiecesTaken = [];

  for (let i=0; i < props.takenPiecesWhite.length; i ++) {
    whitePiecesTaken.push(<img src={props.takenPiecesWhite[i].occupied} key={i}/>);
  }
  for (let i=0; i < props.takenPiecesBlack.length; i ++) {
    blackPiecesTaken.push(<img src={props.takenPiecesBlack[i].occupied} key={i}/>);
  }

  return(
    <div>
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
