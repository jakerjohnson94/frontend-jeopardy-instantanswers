function JeopardyCell(rowIndex, columnIndex) {
  Cell.call(this, rowIndex, columnIndex);
  this.category = null;
}

JeopardyCell.prototype = Object.create(Cell.prototype);
JeopardyCell.prototype.constructor = Cell;

// JeopardyCell.prototype.addContent = function(value) {
//   const categoryName = document.createElement('span');
//   categoryName.textContent = this.value;
//   this.element.appendChild(categoryName);
// };
JeopardyCell.prototype.makeCurrentCell = function(board) {
  this.isCurrentCell = true;
  this.element.classList.add('currentCell');
  board.currentClue = this.clue;
};
