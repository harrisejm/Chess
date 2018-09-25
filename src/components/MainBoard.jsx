import React from 'react';
import PropTypes from 'prop-types';


class MainBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: []
    };
    this.populateBoard = this.populateBoard.bind(this);

  }

populateBoard() {
  let newBoard = this.state.board.slice();
  newBoard.push(updatedPosition);
  this.setState({board: newBoard});

  }

testRender(){
  let test = {
    color: "green"
  }
  const chessBoard =
    <div>
      <p style={test}>Does this work</p>
    </div>;
  return chessBoard;
}


render(){


  return (
    <div>
     <p>dsgfdghghghfg</p>
       {this.testRender()}
    </div>
  );
}
}



export default MainBoard;
