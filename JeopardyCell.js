function JeopardyCell(rowIndex, columnIndex) {
  Cell.call(this, rowIndex, columnIndex);
}

JeopardyCell.prototype = Object.create(Cell.prototype);
JeopardyCell.prototype.constructor = Cell;
