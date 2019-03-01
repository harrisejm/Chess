import React from 'react';
import PropTypes from 'prop-types';


class PiecesToSelect extends React.Component {

  allPiecesForSelection(props) {
    let selectW = [];
    let selectB = [];
    let allPieces = [];

    for (let i=0; i <props.selectPieceWhite.length; i ++) {
      selectW.push(<img onClick={()=>props.selectTakenPiece(i)} src={props.selectPieceWhite[i].occupied} key={i}/>);
    }
    for (let i=0; i <props.selectPieceBlack.length; i ++) {
      selectB.push(<img onClick={()=>props.selectTakenPiece(i)} src={props.selectPieceBlack[i].occupied} key={i}/>);
    }
    allPieces.push(selectW,selectB);
    return allPieces;
  }

  populateSelection(props){
    let pieceColor;
    if (props.switchPawn[0] === 0) {
      pieceColor = this.allPiecesForSelection(this.props)[0];
    } else if (props.switchPawn[0] === 7) {
      pieceColor = this.allPiecesForSelection(this.props)[1];
    }
    let pieceSelection =
    <div>
    <p>{pieceColor}</p>
    </div>;
    return pieceSelection;
  }


  render(props){
    if (this.props.showPieceSelectionModal === false) {
      return null;
    }
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 400,
      minHeight: 200,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 200,
      padding: 30
    };
    const movePieces = {
      maxWidth: 255,
      // border: 'solid',
       margin: 'auto',
    };
    const moveText = {
      maxWidth: 165,
      // border: 'solid',
       margin: 'auto',
    };
    const title = {
      fontSize: 30,
    };
    return(
      <div style={backdropStyle}>
      <div style={modalStyle}>
      <div style={moveText}>
      <p style={title}>Select Piece</p>
      </div>
      <div style={movePieces}>

      {this.populateSelection(this.props)}

      </div>
      </div>
      </div>
    );
  }
}

PiecesToSelect.propTypes = {
  allPiecesForSelection: PropTypes.element
};
export default PiecesToSelect;
