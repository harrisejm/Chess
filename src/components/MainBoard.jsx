import React from 'react';
import PropTypes from 'prop-types';




class MainBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: []
    };
    this.populateBoard = this.populateBoard.bind(this);
    this.testRender = this.testRender.bind(this);
    this.testAdd = this.testAdd.bind(this);
  }

populateBoard() {
  let newBoard = this.state.board.slice();
let objectArr = [];

  for (let i = 0; i < 8; i++) {
    for (let a = 0; a < 8; a++) {
      let position = i.toString() + a.toString();
     if (i === 0 || i === 1 || i === 6 || i === 7) {

     let test1 = Object.assign({positionY: i, positionX: a, occupied: true}, {});

     objectArr.push(test1);
     } else {
       let test2 = Object.assign({positionY: i, positionX: a, occupied: false}, {});
       objectArr.push(test2);
     }
     if (a === 7) {
    //   arr.push(positionArr);
    //   objectArr.push(" ");
       newBoard.push(objectArr);
       objectArr = [];
   }
    }
  }
  this.setState({board: newBoard});
  console.log(this.state.board.length);
  if (this.state.board.length === 8) {
  //  testAdd()
  }
//  return this.testRender();
  }

//  const { expect } = window;

  // window.onload = function() {
  //   this.populateBoard();
  // }

testAdd() {
//  return this.state.board[0][0].occupied;
}

testRender(){
  let test = {
    color: "green"
  }

  const chessBoard =
    <div>
      <p style={test}>Does this work</p>
    <table>
      <tbody>
         <tr className="row1">
           <td> {this.state.length} TESTTEST</td>
         </tr>
         <tr className="row2">
         </tr>
         <tr className="row3">
         </tr>
         <tr className="row4">
         </tr>
         <tr className="row5">
         </tr>
         <tr className="row6">
         </tr>
         <tr className="row7">
         </tr>
         <tr className="row8">
         </tr>
      </tbody>
    </table>
 </div>;
  return chessBoard;
}

render(){

  return (
    <div>
     <p>dsgfdghghghfg</p>
       {this.testRender()}
       <p onClick={this.populateBoard}>Push</p>
    </div>
  );
}
}

// App.propTypes = {
//   populateBoard: PropTypes.func
// };



export default MainBoard;
