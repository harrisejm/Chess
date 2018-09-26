import React from 'react';
import PropTypes from 'prop-types';

class MainBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: [],
      click: 0,
      moveFrom: [],
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
        if (i === 1 || i === 6) {
          let test1 = Object.assign({positionY: i, positionX: a, occupied: 'pawn'}, {});
          objectArr.push(test1);
        } else if ((i === 0 && a === 0) || (i === 0 && a === 7) || (i === 7 && a === 0) || (i === 7 && a === 7)) {
          let test2 = Object.assign({positionY: i, positionX: a, occupied: 'Rook'}, {});
          objectArr.push(test2);
        } else if ((i === 0 && a === 1) || (i === 0 && a === 6) || (i === 7 && a === 1) || (i === 7 && a === 6)) {
          let test2 = Object.assign({positionY: i, positionX: a, occupied: 'Knight'}, {});
          objectArr.push(test2);
        } else if ((i === 0 && a === 2) || (i === 0 && a === 5) || (i === 7 && a === 2) || (i === 7 && a === 5)) {
          let test2 = Object.assign({positionY: i, positionX: a, occupied: 'Bishop'}, {});
          objectArr.push(test2);
        } else if ((i === 0 && a === 3) || (i === 7 && a === 3)) {
          let test2 = Object.assign({positionY: i, positionX: a, occupied: 'Queen'}, {});
          objectArr.push(test2);
        } else if ((i === 0 && a === 4) || (i === 7 && a === 4)) {
          let test2 = Object.assign({positionY: i, positionX: a, occupied: 'King'}, {});
          objectArr.push(test2);
        } else {
          let test2 = Object.assign({positionY: i, positionX: a, occupied: null}, {});
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
   //let newMoveFrom = this.state.moveFrom;
//   let newMoveTo = this.state.moveTo;

   if (this.state.click === 0) {
     this.setState({click: 1});
     this.setState({moveFrom: [pos[0],pos[1]]});
   }

   if (this.state.click === 1) {
     this.setState({click: 0});
     this.setState({moveTo: [pos[0],pos[1]]});
   }


  if (this.state.board[pos[0]][pos[1]].occupied === 'true') {
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
// for (let q = 0; q < 8; q++) {
//   for (let z = 0; z < 8; z++) {
//     grid.push(React.createElement('td', {className: 'hello'}, this.state.board[q][z].occupied))
//   }
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
    <p style={test}>{this.state.click} Does this work</p>

      <table>
        <tbody>
          <tr className="row1">
            <td onClick={()=>this.movePiece([0,0])}>{this.state.board[0][0].occupied}</td>
            <td onClick={()=>this.movePiece([0,1])}>{this.state.board[0][1].occupied}</td>
            <td onClick={()=>this.movePiece([0,2])}>{this.state.board[0][2].occupied}</td>
            <td onClick={()=>this.movePiece([0,3])}>{this.state.board[0][3].occupied}</td>
            <td onClick={()=>this.movePiece([0,4])}>{this.state.board[0][4].occupied}</td>
            <td onClick={()=>this.movePiece([0,5])}>{this.state.board[0][5].occupied}</td>
            <td onClick={()=>this.movePiece([0,6])}>{this.state.board[0][6].occupied}</td>
            <td onClick={()=>this.movePiece([0,7])}>{this.state.board[0][7].occupied}</td>
          </tr>
          <tr className="row2">
            <td onClick={()=>this.movePiece([1,0])}>{this.state.board[1][0].occupied}</td>
            <td onClick={()=>this.movePiece([1,1])}>{this.state.board[1][1].occupied}</td>
            <td onClick={()=>this.movePiece([1,2])}>{this.state.board[1][2].occupied}</td>
            <td onClick={()=>this.movePiece([1,3])}>{this.state.board[1][3].occupied}</td>
            <td onClick={()=>this.movePiece([1,4])}>{this.state.board[1][4].occupied}</td>
            <td onClick={()=>this.movePiece([1,5])}>{this.state.board[1][5].occupied}</td>
            <td onClick={()=>this.movePiece([1,6])}>{this.state.board[1][6].occupied}</td>
            <td onClick={()=>this.movePiece([1,7])}>{this.state.board[1][7].occupied}</td>
          </tr>
          <tr className="row3">
            <td onClick={()=>this.movePiece([2,0])}>{this.state.board[2][0].occupied}</td>
            <td onClick={()=>this.movePiece([2,1])}>{this.state.board[2][1].occupied}</td>
            <td onClick={()=>this.movePiece([2,2])}>{this.state.board[2][2].occupied}</td>
            <td onClick={()=>this.movePiece([2,3])}>{this.state.board[2][3].occupied}</td>
            <td onClick={()=>this.movePiece([2,4])}>{this.state.board[2][4].occupied}</td>
            <td onClick={()=>this.movePiece([2,5])}>{this.state.board[2][5].occupied}</td>
            <td onClick={()=>this.movePiece([2,6])}>{this.state.board[2][6].occupied}</td>
            <td onClick={()=>this.movePiece([2,7])}>{this.state.board[2][7].occupied}</td>
          </tr>
          <tr className="row4">
            <td onClick={()=>this.movePiece([3,0])}>{this.state.board[3][0].occupied}</td>
            <td onClick={()=>this.movePiece([3,1])}>{this.state.board[3][1].occupied}</td>
            <td onClick={()=>this.movePiece([3,2])}>{this.state.board[3][2].occupied}</td>
            <td onClick={()=>this.movePiece([3,3])}>{this.state.board[3][3].occupied}</td>
            <td onClick={()=>this.movePiece([3,4])}>{this.state.board[3][4].occupied}</td>
            <td onClick={()=>this.movePiece([3,5])}>{this.state.board[3][5].occupied}</td>
            <td onClick={()=>this.movePiece([3,6])}>{this.state.board[3][6].occupied}</td>
            <td onClick={()=>this.movePiece([3,7])}>{this.state.board[3][7].occupied}</td>
          </tr>
          <tr className="row5">
            <td onClick={()=>this.movePiece([4,0])}>{this.state.board[4][0].occupied}</td>
            <td onClick={()=>this.movePiece([4,1])}>{this.state.board[4][1].occupied}</td>
            <td onClick={()=>this.movePiece([4,2])}>{this.state.board[4][2].occupied}</td>
            <td onClick={()=>this.movePiece([4,3])}>{this.state.board[4][3].occupied}</td>
            <td onClick={()=>this.movePiece([4,4])}>{this.state.board[4][4].occupied}</td>
            <td onClick={()=>this.movePiece([4,5])}>{this.state.board[4][5].occupied}</td>
            <td onClick={()=>this.movePiece([4,6])}>{this.state.board[4][6].occupied}</td>
            <td onClick={()=>this.movePiece([4,7])}>{this.state.board[4][7].occupied}</td>
          </tr>
          <tr className="row6">
            <td onClick={()=>this.movePiece([5,0])}>{this.state.board[5][0].occupied}</td>
            <td onClick={()=>this.movePiece([5,1])}>{this.state.board[5][1].occupied}</td>
            <td onClick={()=>this.movePiece([5,2])}>{this.state.board[5][2].occupied}</td>
            <td onClick={()=>this.movePiece([5,3])}>{this.state.board[5][3].occupied}</td>
            <td onClick={()=>this.movePiece([5,4])}>{this.state.board[5][4].occupied}</td>
            <td onClick={()=>this.movePiece([5,5])}>{this.state.board[5][5].occupied}</td>
            <td onClick={()=>this.movePiece([5,6])}>{this.state.board[5][6].occupied}</td>
            <td onClick={()=>this.movePiece([5,7])}>{this.state.board[5][7].occupied}</td>
          </tr>
          <tr className="row7">
            <td onClick={()=>this.movePiece([6,0])}>{this.state.board[6][0].occupied}</td>
            <td onClick={()=>this.movePiece([6,1])}>{this.state.board[6][1].occupied}</td>
            <td onClick={()=>this.movePiece([6,2])}>{this.state.board[6][2].occupied}</td>
            <td onClick={()=>this.movePiece([6,3])}>{this.state.board[6][3].occupied}</td>
            <td onClick={()=>this.movePiece([6,4])}>{this.state.board[6][4].occupied}</td>
            <td onClick={()=>this.movePiece([6,5])}>{this.state.board[6][5].occupied}</td>
            <td onClick={()=>this.movePiece([6,6])}>{this.state.board[6][6].occupied}</td>
            <td onClick={()=>this.movePiece([6,7])}>{this.state.board[6][7].occupied}</td>
          </tr>
          <tr className="row8">
            <td onClick={()=>this.movePiece([7,0])}>{this.state.board[7][0].occupied}</td>
            <td onClick={()=>this.movePiece([7,1])}>{this.state.board[7][1].occupied}</td>
            <td onClick={()=>this.movePiece([7,2])}>{this.state.board[7][2].occupied}</td>
            <td onClick={()=>this.movePiece([7,3])}>{this.state.board[7][3].occupied}</td>
            <td onClick={()=>this.movePiece([7,4])}>{this.state.board[7][4].occupied}</td>
            <td onClick={()=>this.movePiece([7,5])}>{this.state.board[7][5].occupied}</td>
            <td onClick={()=>this.movePiece([7,6])}>{this.state.board[7][6].occupied}</td>
            <td onClick={()=>this.movePiece([7,7])}>{this.state.board[7][7].occupied}</td>
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
