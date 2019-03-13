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
    <p>There are two game modes available. Two plays can play against each other locally on one screen, or play against each other online on two different devices.</p>
    <h4> Local Play (One Screen Mode)</h4>
    <p>Two players can play on one screen and alternate moves until the game is complete. To play, click the "Local Play" button in the navigation bar at the top of the screen. If you navigate away from Local Play, your game will reset. This is the default game mode.</p>
    <h4>Online Play (Two Device Mode)</h4>
    <p>Two players can play against each other on two different devices. To begin, click the "Online Play" button button in navigation bar at the top of the screen. You will then be prompted to select either "Player 1" or "Player 2". Your opponent must then navigate to this website and select the opposite player.</p>
    <br/>
<p><i><b>This site currently does not support the ability for more than one online game to played at a time. Game data is synced with only one database.</b></i></p>
<p><b>** Online play on two devices is not fully supported on Safari **</b></p>
<br/>
<button onClick={()=>this.props.closeHowToPlayModal()}>Close</button>
  </div>
  </div>


);
}
}
HowToPlay.propTypes = {

};

export default HowToPlay;
