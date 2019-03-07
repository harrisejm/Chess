import React from 'react';
import PropTypes from 'prop-types';

class GameOver extends React.Component {
  render(props){
    if (this.props.showGameOverModal === false) {
      return null;
    }
    let restartButton;
    if (this.props.handle === 'playerOne' || this.props.handle === 'playerTwo') {
      restartButton = <button onClick={()=>this.props.firebaseBoard()}>Start New Game</button>
    } else {
      restartButton = <button onClick={()=>this.props.populateBoard()}>Start New Game</button>
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
      // backgroundColor: '#fff',
      // borderRadius: 5,
      maxWidth: 600,
      minHeight: 200,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 200,
      padding: 30,
      textAlign: 'center'
    };
    const endOfGameMessage = {
      fontSize: 50,
      color: 'white'
    }

return(
  <div style={backdropStyle}>
  <div style={modalStyle}>
    <p style={endOfGameMessage}>Game Over: {this.props.gameOverBy}</p>
    {restartButton}
  </div>
  </div>


);
}
}
GameOver.propTypes = {

};

export default GameOver;
