import React from 'react';
import PropTypes from 'prop-types';

class HowToPlay extends React.Component {

  render(props){
    if (this.props.howToPlayModal === false) {
      return null;
    }

    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 50
    };
    const modalStyle = {
      // backgroundColor: '#fff',
      // borderRadius: 5,
      maxWidth: 600,
      minHeight: 200,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 50,
      padding: 30,
      textAlign: 'center'
    };
    const endOfGameMessage = {
      fontSize: 50,
      color: 'white'
    }





return(
  <div style={backdropStyle}>

  <style jsx>{`
    p, li, h4 {
      color: white;

    }

    `}</style>
  <div style={modalStyle}>
    <p style={endOfGameMessage}></p>
    <p>There are two game modes available. Two plays can play against each other on one screen, or play against each other on two different devices</p>
    <h4>One Screen Mode</h4>
    <p>Two players can play on one screen and alternate moves until the game is complete. To play in one screen mode, click the "....." button in the navigation bar at the top of the screen. If you navigate away from the </p>
    <h4>Two Device Mode</h4>
    <p>Two players can play against each other on two different devices. To begin, click the "Player 1" or "Player 2" button in navigation bar at the top of the screen. Your opponent must then navigate to this website and click the opposite "Player" button.</p>
    <p><i><b>This site currently does not support the ability to allow more than one game in Two Device Mode to be played. If more than one game (in Two Device Mode) is being played, player's moves would interfear with each other. This website only supports two players at a time</b></i></p>
<button onClick={()=>this.props.closeHowToPlayModal()}>Close</button>
  </div>
  </div>


);
}
}
HowToPlay.propTypes = {

};

export default HowToPlay;
