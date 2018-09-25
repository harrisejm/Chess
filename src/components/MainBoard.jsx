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
  let objectArr = [];
  //let arr = [];
  for (let i = 0; i < 8; i++) {
  //let positionArr = [];

    for (let a = 0; a < 8; a++) {
      let position = i.toString() + a.toString();
     if (i === 0 || i === 1 || i === 6 || i === 7) {

     let test1 = Object.assign({positionY: i, positionX: a, occupied: true}, {});

    // objectArr.push( position: { positionY: i, positionX: a, occupied: true });
     objectArr.push(test1);
     } else {
       let test2 = Object.assign({positionY: i, positionX: a, occupied: false}, {});
       objectArr.push(test2);
        // { positionY: i, positionX: a, occupied: false }
    //     objectArr.push( position: { positionY: i, positionX: a, occupied: false });
     }

     if (a === 7) {
    //   arr.push(positionArr);
    //   objectArr.push(" ");
       newBoard.push(objectArr);
       objectArr = [];
   }


    }
  }
//newBoard.push(objectArr);
//const arr = newBoard.join("").trim().split(" ");
  //newBoard.push(updatedPosition);
  this.setState({board: newBoard});
  console.log(this.state)
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

       <p onClick={this.populateBoard}>Push</p>
    </div>
  );
}
}

// App.propTypes = {
//   populateBoard: PropTypes.func
// };



export default MainBoard;
