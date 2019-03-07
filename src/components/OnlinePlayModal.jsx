import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class OnlinePlayModal extends React.Component {

  render(props){
    if (this.props.onlinePlayModal === false) {
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
    button {
      margin: 20px;
    }

    `}</style>
  <div style={modalStyle}>
    <p style={endOfGameMessage}></p>
    <h4>Two Device Mode</h4>
    <p>Two players can play against each other on two different devices. To begin, click the "Player 1" or "Player 2" button. Your opponent must then navigate to this website and click the opposite "Player" button.</p>
    <div>
    <Link to={"/playerOne"} onClick={()=>this.props.updateStateFromDatabase()}><button onClick={()=>this.props.closeOnlinePlayModal()}>Player 1 (White)</button></Link>
    <Link to={"/playerTwo"} onClick={()=>this.props.updateStateFromDatabase()}><button onClick={()=>this.props.closeOnlinePlayModal()}>Player 2 (Black)</button></Link></div>
    <p><i><b>This site currently does not support the ability for more than one online game to played at a time. Game data is synced with only one database.</b></i></p>


<button onClick={()=>this.props.closeOnlinePlayModal()}>Cancel</button>
  </div>
  </div>


);
}
}
OnlinePlayModal.propTypes = {

};

export default OnlinePlayModal;