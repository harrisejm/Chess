import React from 'react';
import PropTypes from 'prop-types';

import bb from '../assets/img/BB.png';
import bk from '../assets/img/BK.png';
import bkn from '../assets/img/Bkn.png';
import bp from '../assets/img/BP.png';
import bq from '../assets/img/BQ.png';
import br from '../assets/img/BR.png';

import wb from '../assets/img/WB.png';
import wk from '../assets/img/WK.png';
import wkn from '../assets/img/WKn.png';
import wp from '../assets/img/WP.png';
import wq from '../assets/img/WQ.png';
import wr from '../assets/img/WR.png';



class MainBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      board: [],
      click: 0,
      moveFrom: [],
      moveTo: [],
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
        if (i === 1) {
          let test1 = Object.assign({positionY: i, positionX: a, color: 'black', occupied: bp}, {});
          objectArr.push(test1);
        } else if (i === 6) {
            let test1 = Object.assign({positionY: i, positionX: a, color: 'white', occupied: wp}, {});
            objectArr.push(test1);

        } else if ((i === 0 && a === 0) || (i === 0 && a === 7)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', occupied: br}, {});
          objectArr.push(test2);
        } else if ((i === 7 && a === 0) || (i === 7 && a === 7)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', occupied: wr}, {});
          objectArr.push(test2);

        } else if ((i === 0 && a === 1) || (i === 0 && a === 6)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', occupied: bkn}, {});
          objectArr.push(test2);
        } else if ((i === 7 && a === 1) || (i === 7 && a === 6)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', occupied: wkn}, {});
          objectArr.push(test2);


        } else if ((i === 0 && a === 2) || (i === 0 && a === 5)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', occupied: bb}, {});
          objectArr.push(test2);
        } else if ((i === 7 && a === 2) || (i === 7 && a === 5)) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', occupied: wb}, {});
          objectArr.push(test2);

        } else if (i === 0 && a === 3) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', occupied: bq}, {});
          objectArr.push(test2);
        } else if (i === 7 && a === 3) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', occupied: wq}, {});
          objectArr.push(test2);

        } else if (i === 0 && a === 4) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'black', occupied: bk}, {});
          objectArr.push(test2);
        } else if (i === 7 && a === 4) {
          let test2 = Object.assign({positionY: i, positionX: a, color: 'white', occupied: wk}, {});
          objectArr.push(test2);

        } else {
          let test2 = Object.assign({positionY: i, positionX: a, color: null, occupied: null}, {});
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

   if (this.state.click === 0) {
     if (this.state.board[pos[0]][pos[1]].occupied !== null) {
       this.setState({click: 1});
       this.setState({moveFrom: [pos[0],pos[1]]});
     }
   }

   if (this.state.click === 1) {
  //   if (this.state.board[pos[0]][pos[1]].occupied === null) {
          //  this.setState({click: 0});
//     }
  //   this.setState({moveTo: [pos[0],pos[1]]});
   }

  // if (this.state.board[pos[0]][pos[1]].occupied === 'true') {
  //   newBoard[pos[0]][pos[1]].occupied = 'false';
  // } else {
  //   newBoard[pos[0]][pos[1]].occupied = 'true';
  // }

  if (this.state.moveFrom.length !== 0 && this.state.click === 1) {
    if (this.state.board[this.state.moveFrom[0]][this.state.moveFrom[1]].color !== this.state.board[pos[0]][pos[1]].color) {


    newBoard[pos[0]][pos[1]].occupied = newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied;
    newBoard[pos[0]][pos[1]].color = newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].color;
    newBoard[this.state.moveFrom[0]][this.state.moveFrom[1]].occupied = null;


  //  console.log(this.state.moveFrom[0]);
    console.log(newBoard);
    this.setState({board: newBoard, click: 0})
  } else {
    this.setState({moveFrom: [pos[0],pos[1]]});
    //this.setState({board: newBoard})
  }
  }

//    this.setState({board: newBoard})
    console.log(this.state.board);
  }

  testRender(){
    let squareColor = {
    //  color: "green"
    backgroundColor: "#ADD8E6"
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
           width: 70px;
           height: 70px;
         }
      `}</style>

    <p>Move From: [{this.state.moveFrom[0]},{this.state.moveFrom[1]}]</p>
    <p>Move To: [{this.state.moveTo[0]},{this.state.moveTo[1]}]</p>


    <img src={bb}/>
    <img src={bk}/>
    <img src={bkn}/>
    <img src={bp}/>
    <img src={bq}/>
    <img src={br}/>

    <img src={wb}/>
    <img src={wk}/>
    <img src={wkn}/>
    <img src={wp}/>
    <img src={wq}/>
    <img src={wr}/>
  <p>{this.state.click} Does this work</p>
      <table>
        <tbody>
          <tr className="row1">
            <td onClick={()=>this.movePiece([0,0])}><img src={this.state.board[0][0].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([0,1])}><img src={this.state.board[0][1].occupied}/></td>
            <td onClick={()=>this.movePiece([0,2])}><img src={this.state.board[0][2].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([0,3])}><img src={this.state.board[0][3].occupied}/></td>
            <td onClick={()=>this.movePiece([0,4])}><img src={this.state.board[0][4].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([0,5])}><img src={this.state.board[0][5].occupied}/></td>
            <td onClick={()=>this.movePiece([0,6])}><img src={this.state.board[0][6].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([0,7])}><img src={this.state.board[0][7].occupied}/></td>
          </tr>
          <tr className="row2">
            <td style={squareColor} onClick={()=>this.movePiece([1,0])}><img src={this.state.board[1][0].occupied}/></td>
            <td onClick={()=>this.movePiece([1,1])}><img src={this.state.board[1][1].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([1,2])}><img src={this.state.board[1][2].occupied}/></td>
            <td onClick={()=>this.movePiece([1,3])}><img src={this.state.board[1][3].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([1,4])}><img src={this.state.board[1][4].occupied}/></td>
            <td onClick={()=>this.movePiece([1,5])}><img src={this.state.board[1][5].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([1,6])}><img src={this.state.board[1][6].occupied}/></td>
            <td onClick={()=>this.movePiece([1,7])}><img src={this.state.board[1][7].occupied}/></td>
          </tr>
          <tr className="row3">
            <td onClick={()=>this.movePiece([2,0])}><img src={this.state.board[2][0].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([2,1])}><img src={this.state.board[2][1].occupied}/></td>
            <td onClick={()=>this.movePiece([2,2])}><img src={this.state.board[2][2].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([2,3])}><img src={this.state.board[2][3].occupied}/></td>
            <td onClick={()=>this.movePiece([2,4])}><img src={this.state.board[2][4].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([2,5])}><img src={this.state.board[2][5].occupied}/></td>
            <td onClick={()=>this.movePiece([2,6])}><img src={this.state.board[2][6].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([2,7])}><img src={this.state.board[2][7].occupied}/></td>
          </tr>
          <tr className="row4">
            <td style={squareColor} onClick={()=>this.movePiece([3,0])}><img src={this.state.board[3][0].occupied}/></td>
            <td onClick={()=>this.movePiece([3,1])}><img src={this.state.board[3][1].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([3,2])}><img src={this.state.board[3][2].occupied}/></td>
            <td onClick={()=>this.movePiece([3,3])}><img src={this.state.board[3][3].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([3,4])}><img src={this.state.board[3][4].occupied}/></td>
            <td onClick={()=>this.movePiece([3,5])}><img src={this.state.board[3][5].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([3,6])}><img src={this.state.board[3][6].occupied}/></td>
            <td onClick={()=>this.movePiece([3,7])}><img src={this.state.board[3][7].occupied}/></td>
          </tr>
          <tr className="row5">
            <td onClick={()=>this.movePiece([4,0])}><img src={this.state.board[4][0].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([4,1])}><img src={this.state.board[4][1].occupied}/></td>
            <td onClick={()=>this.movePiece([4,2])}><img src={this.state.board[4][2].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([4,3])}><img src={this.state.board[4][3].occupied}/></td>
            <td onClick={()=>this.movePiece([4,4])}><img src={this.state.board[4][4].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([4,5])}><img src={this.state.board[4][5].occupied}/></td>
            <td onClick={()=>this.movePiece([4,6])}><img src={this.state.board[4][6].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([4,7])}><img src={this.state.board[4][7].occupied}/></td>
          </tr>
          <tr className="row6">
            <td style={squareColor} onClick={()=>this.movePiece([5,0])}><img src={this.state.board[5][0].occupied}/></td>
            <td onClick={()=>this.movePiece([5,1])}><img src={this.state.board[5][1].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([5,2])}><img src={this.state.board[5][2].occupied}/></td>
            <td onClick={()=>this.movePiece([5,3])}><img src={this.state.board[5][3].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([5,4])}><img src={this.state.board[5][4].occupied}/></td>
            <td onClick={()=>this.movePiece([5,5])}><img src={this.state.board[5][5].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([5,6])}><img src={this.state.board[5][6].occupied}/></td>
            <td onClick={()=>this.movePiece([5,7])}><img src={this.state.board[5][7].occupied}/></td>
          </tr>
          <tr className="row7">
            <td onClick={()=>this.movePiece([6,0])}><img src={this.state.board[6][0].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([6,1])}><img src={this.state.board[6][1].occupied}/></td>
            <td onClick={()=>this.movePiece([6,2])}><img src={this.state.board[6][2].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([6,3])}><img src={this.state.board[6][3].occupied}/></td>
            <td onClick={()=>this.movePiece([6,4])}><img src={this.state.board[6][4].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([6,5])}><img src={this.state.board[6][5].occupied}/></td>
            <td onClick={()=>this.movePiece([6,6])}><img src={this.state.board[6][6].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([6,7])}><img src={this.state.board[6][7].occupied}/></td>
          </tr>
          <tr className="row8">
            <td style={squareColor} onClick={()=>this.movePiece([7,0])}><img src={this.state.board[7][0].occupied}/></td>
            <td onClick={()=>this.movePiece([7,1])}><img src={this.state.board[7][1].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([7,2])}><img src={this.state.board[7][2].occupied}/></td>
            <td onClick={()=>this.movePiece([7,3])}><img src={this.state.board[7][3].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([7,4])}><img src={this.state.board[7][4].occupied}/></td>
            <td onClick={()=>this.movePiece([7,5])}><img src={this.state.board[7][5].occupied}/></td>
            <td style={squareColor} onClick={()=>this.movePiece([7,6])}><img src={this.state.board[7][6].occupied}/></td>
            <td onClick={()=>this.movePiece([7,7])}><img src={this.state.board[7][7].occupied}/></td>
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
