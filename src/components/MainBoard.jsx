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
    if (this.state.board.length === 8) {
    }
  }

  componentWillMount(){
    this.populateBoard();
  }

  testRender(){
    let test = {
      color: "green"
    }

  //  const row1 = <td> {this.state.board[0][0].occupied} </td>;
  //  const row2 = <td> {this.state.board[3][0].occupied} </td>;
let greeting = React.createElement('h1', {}, this.state.board[3][0].occupied);

    const chessBoard =
    <div>
      <style jsx>{`

      `}</style>
      <p style={test}>Does this work</p>
      {greeting}
      <table>
        <tbody>
          <tr className="row1">
            <td>{this.state.board[0][0].occupied}</td>
            <td>{this.state.board[0][1].occupied}</td>
            <td>{this.state.board[0][2].occupied}</td>
            <td>{this.state.board[0][3].occupied}</td>       <td>{this.state.board[0][4].occupied}</td>
            <td>{this.state.board[0][5].occupied}</td>
            <td>{this.state.board[0][6].occupied}</td>
            <td>{this.state.board[0][7].occupied}</td>;
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
