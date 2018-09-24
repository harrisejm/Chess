let board = [[1, 2, 3, 4, 5],
             [6, 7, 8, 9, 10],
             [12,13,14,15,16],
             [17,18,19,20,21]];

let BoardPos = function(positionY, positionX, occupied) {
  this.positionY = positionY;
  this.positionX = positionX;
  this.occupied = occupied;
//  this.piece = null;
}

//gen board with BoardPos object.
let arr = [];   /// this will be STATE
let arrTest = [];
let selectedRow = 0;
let selectedId = 0;

for (let i = 0; i < 8; i++) {
let positionArr = [];
let objectArr = [];
selectedRow += 1;
  for (let a = 0; a < 8; a++) {
   if (i === 0 || i === 1 || i === 6 || i === 7) {
     let position = new BoardPos(i,a,true);
     objectArr.push(position);

     let space = document.createElement("td");
     let node = document.createTextNode("[" + i + "," + a +"]" + position.occupied);
     space.appendChild(node);

     let element = document.getElementById("row" + selectedRow.toString());
     element.appendChild(space);

     let spaceId = i.toString() + a.toString();
     document.getElementsByTagName("td")[selectedId].setAttribute("id", spaceId);
     selectedId += 1;
   } else {
       let position = new BoardPos(i,a,false);
       objectArr.push(position);

       //Add cord and text (occupied: true)
       let space = document.createElement("td");
       let node = document.createTextNode("[" + i + "," + a +"]" + position.occupied);
       space.appendChild(node);
       let element = document.getElementById("row" + selectedRow.toString());
       element.appendChild(space);

       ///Add Id to td
       let spaceId = i.toString() + a.toString();
       document.getElementsByTagName("td")[selectedId].setAttribute("id", spaceId);
       selectedId += 1;
   }
   positionArr.push("[" + i + "," + a +"]");
   if (a === 7) {
     arr.push(positionArr);
     arrTest.push(objectArr);
     //position.length = 0;
   }
  }
}

/////////////
let Pawn = function(firstMove, selected, color, taken, positionY, positionX) {
  this.firstMove = firstMove;
  this.selected = selected;
  this.color = color;
  this.taken = taken;
  this.positionY = positionY;
  this.positionX = positionX;
  this.movePawn = function(testMove){

    if (testMove === board[this.positionY - 1][this.positionX]) {
      this.positionX = this.positionX;
      this.positionY = this.positionY - 1;
    } else if (this.firstMove === true && testMove === board[this.positionY - 2][this.positionX]) {
      this.positionX = this.positionX;
      this.positionY = this.positionY - 2;
      this.firstMove = false;
    }
  }
}

let testMove = board[1][2];

// Pawn.prototype.movePawn = function(testMove) {
//   if (testMove === board[this.positionY - 1][this.positionX]) {
//     this.positionX = this.positionX;
//     this.positionY = this.positionY - 1;
//   } else if (this.firstMove === true && testMove === board[this.positionY - 2][this.positionX]) {
//     this.positionX = this.positionX;
//     this.positionY = this.positionY - 2;
//     this.firstMove = false;
//   }
// }

pawn1 = new Pawn(true, true, "white", false, 3, 2);
pawn1.movePawn(testMove);

//board TEST if boardPos object are in the array
let hello = [];
for (let b = 0; b < arrTest.length; b++) {
  for (let q = 0; q < 8; q++) {
  hello.push("occupied " + arrTest[b][q].occupied);
  }
}
//////

document.getElementById("00").innerHTML = "hi";

document.getElementById("test").innerHTML = board[pawn1.positionY][pawn1.positionX];
document.getElementById("test1").innerHTML = pawn1.positionY;
document.getElementById("test2").innerHTML = pawn1.positionX;
document.getElementById("test3").innerHTML = arr;
document.getElementById("test4").innerHTML = arrTest[0][0].occupied;
document.getElementById("test5").innerHTML = hello;
