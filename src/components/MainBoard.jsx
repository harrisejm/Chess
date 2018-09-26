import React from 'react';
import PropTypes from 'prop-types';

class MainBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: [],
      click: 0,
      moveFrom: [0,0],
      moveTo: []

    };
    this.populateBoard = this.populateBoard.bind(this);
    this.testRender = this.testRender.bind(this);
    this.movePiece = this.movePiece.bind(this);
  }

  populateBoard() {
    let newBoard = this.state.board.slice();
    let objectArr = [];

    for (let i = 0; i < 8; i++) {
      for (let a = 0; a < 8; a++) {
      //  let position = i.toString() + a.toString();
        if (i === 0 || i === 1 || i === 6 || i === 7) {
          let test1 = Object.assign({positionY: i, positionX: a, occupied: 'true'}, {});
          objectArr.push(test1);
        } else {
          let test2 = Object.assign({positionY: i, positionX: a, occupied: 'false'}, {});
          objectArr.push(test2);
        }
        if (a === 7) {
          newBoard.push(objectArr);
          objectArr = [];
        }
      }
    }
    this.setState({board: newBoard});
    console.log(this.state.board.length);
  }

  componentWillMount(){
    this.populateBoard();
  }

  movePiece(pos){
   let newBoard = this.state.board.slice();
   //let pos = newPosition.split("");
  //  if (this.state.click === 0) {
  //  let currentMove = this.state.moveFrom;
  //  currentMove = position;
  //
  //
  //
  //  }

  if (newBoard[pos[0]][pos[1]].occupied === 'true') {
    newBoard[pos[0]][pos[1]].occupied = 'false';
  } else {
    newBoard[pos[0]][pos[1]].occupied = 'true';
  }


    this.setState({board: newBoard})
    console.log(this.state.board);
  }


  testRender(){
    let test = {
      color: "green"
    }

  //  const row1 = <td> {this.state.board[0][0].occupied} </td>;
  //  const row2 = <td> {this.state.board[3][0].occupied} </td>;

// let grid = [];
//
// for (let q = 0; q < 8; q++) {
//   for (let z = 0; z < 8; z++) {
//     grid.push(React.createElement('td', {className: 'hello'}, this.state.board[q][z].occupied))
//   }
//
// }

//let greeting = React.createElement('td', {}, this.state.board[3][0].occupied);

    const chessBoard =
    <div>
      <style jsx>{`
         td {
           border-style: solid;
           width: 60px;
           height: 60px;
         }
      `}</style>
    <p style={test}>Does this work</p>

      <table>
        <tbody>
          <tr className="row1">
            <td
              onClick={() => this.movePiece([0,0])} >{this.state.board[0][0].occupied}</td>
            <td>{this.state.board[0][1].occupied}</td>
            <td>{this.state.board[0][2].occupied}</td>
            <td>{this.state.board[0][3].occupied}</td>
            <td>{this.state.board[0][4].occupied}</td>
            <td>{this.state.board[0][5].occupied}</td>
            <td>{this.state.board[0][6].occupied}</td>
            <td>{this.state.board[0][7].occupied}</td>
          </tr>
          <tr className="row2">
            <td>{this.state.board[1][0].occupied}</td>
            <td>{this.state.board[1][1].occupied}</td>
            <td>{this.state.board[1][2].occupied}</td>
            <td>{this.state.board[1][3].occupied}</td>
            <td>{this.state.board[1][4].occupied}</td>
            <td>{this.state.board[1][5].occupied}</td>
            <td>{this.state.board[1][6].occupied}</td>
            <td>{this.state.board[1][7].occupied}</td>
          </tr>
          <tr className="row3">
            <td>{this.state.board[2][0].occupied}</td>
            <td>{this.state.board[2][1].occupied}</td>
            <td>{this.state.board[2][2].occupied}</td>
            <td>{this.state.board[2][3].occupied}</td>
            <td>{this.state.board[2][4].occupied}</td>
            <td>{this.state.board[2][5].occupied}</td>
            <td>{this.state.board[2][6].occupied}</td>
            <td>{this.state.board[2][7].occupied}</td>
          </tr>
          <tr className="row4">
            <td>{this.state.board[3][0].occupied}</td>
            <td>{this.state.board[3][1].occupied}</td>
            <td>{this.state.board[3][2].occupied}</td>
            <td>{this.state.board[3][3].occupied}</td>
            <td>{this.state.board[3][4].occupied}</td>
            <td>{this.state.board[3][5].occupied}</td>
            <td>{this.state.board[3][6].occupied}</td>
            <td>{this.state.board[3][7].occupied}</td>
          </tr>
          <tr className="row5">
            <td>{this.state.board[4][0].occupied}</td>
            <td>{this.state.board[4][1].occupied}</td>
            <td>{this.state.board[4][2].occupied}</td>
            <td>{this.state.board[4][3].occupied}</td>
            <td>{this.state.board[4][4].occupied}</td>
            <td>{this.state.board[4][5].occupied}</td>
            <td>{this.state.board[4][6].occupied}</td>
            <td>{this.state.board[4][7].occupied}</td>
          </tr>
          <tr className="row6">
            <td>{this.state.board[5][0].occupied}</td>
            <td>{this.state.board[5][1].occupied}</td>
            <td>{this.state.board[5][2].occupied}</td>
            <td>{this.state.board[5][3].occupied}</td>
            <td>{this.state.board[5][4].occupied}</td>
            <td>{this.state.board[5][5].occupied}</td>
            <td>{this.state.board[5][6].occupied}</td>
            <td>{this.state.board[5][7].occupied}</td>
          </tr>
          <tr className="row7">
            <td>{this.state.board[6][0].occupied}</td>
            <td>{this.state.board[6][1].occupied}</td>
            <td>{this.state.board[6][2].occupied}</td>
            <td>{this.state.board[6][3].occupied}</td>
            <td>{this.state.board[6][4].occupied}</td>
            <td>{this.state.board[6][5].occupied}</td>
            <td>{this.state.board[6][6].occupied}</td>
            <td>{this.state.board[6][7].occupied}</td>
          </tr>
          <tr className="row8">
            <td>{this.state.board[7][0].occupied}</td>
            <td>{this.state.board[7][1].occupied}</td>
            <td>{this.state.board[7][2].occupied}</td>
            <td>{this.state.board[7][3].occupied}</td>
            <td>{this.state.board[7][4].occupied}</td>
            <td>{this.state.board[7][5].occupied}</td>
            <td>{this.state.board[7][6].occupied}</td>
            <td>{this.state.board[7][7].occupied}</td>
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
