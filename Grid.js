function Grid(rowCount, columnCount, offsets, cellHeight, cellWidth, outputElement) {
  this.rowCount = rowCount;
  this.columnCount = columnCount;
  this.cellHeight = cellHeight;
  this.cellWidth = cellWidth;
  this.outputElement = outputElement;
  this.offsets = offsets;

  if (this.cellHeight && this.cellWidth) this.changeSizeOfAllCells(this.cellHeight, this.cellWidth);
}

Grid.prototype = {
  createCells: function() {
    this.cellArray = [];
    for (let rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
      const rowElement = document.createElement('div');
      this.outputElement.appendChild(rowElement);
      rowElement.classList.add('row');

      this.cellArray.push([]);
      for (let columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
        const cell = new Cell(rowIndex, columnIndex);

        rowElement.appendChild(cell.element);
        this.cellArray[rowIndex].push(cell);
        cell.element.addEventListener('click', this.boundClickEvent);
      }
    }
  },

  findCell: function(rowIndex, columnIndex) {
    if (!this.cellArray[rowIndex][columnIndex]) return;
    return this.cellArray[rowIndex][columnIndex];
  },
  changeSizeOfAllCells: function(width, height) {
    for (let i in this.cellArray) {
      for (let cell of this.cellArray[i]) {
        cell.changeSize(width, height);
      }
    }
  },
  changeStyleOfAllCells: function(propertyName, value) {
    for (let i in this.cellArray) {
      for (let cell of this.cellArray[i]) {
        cell.addStyle(propertyName, value);
      }
    }
  },

  getCellsByFilter: function(callback) {
    this.filteredCellArray = [];
    for (let i in this.cellArray) {
      if (this.cellArray[i].filter(callback).length) {
        this.filteredCellArray.push(this.cellArray[i].filter(callback));
      }
    }
    return this.filteredCellArray;
  },

  changeStyleOfCellsByFilter(styleName, value, callback) {
    if (callback) this.getCellsByFilter(callback);
    if (!this.filteredCellArray) return;
    for (let i in this.filteredCellArray) {
      for (let cell of this.filteredCellArray[i]) {
        cell.element.style[styleName] = value;
      }
    }
  },

  findValidNeighbors: function(selectedCell, callback) {
    if (!selectedCell) return;
    selectedCell.neighborCellArray = [];
    Object.values(this.offsets).forEach(offset => {
      const [rowOffset, colOffset] = offset;
      const neighborRowIndex = Number(selectedCell.rowIndex) + rowOffset;
      const neighborColumnIndex = Number(selectedCell.columnIndex) + colOffset;
      if (
        this.cellArray[neighborRowIndex] &&
        this.cellArray[neighborRowIndex][neighborColumnIndex] !== undefined
      ) {
        selectedCell.neighborCellArray.push(this.cellArray[neighborRowIndex][neighborColumnIndex]);
      }
    });
    if (callback)
      return (selectedCell.validNeighborCellArray = selectedCell.neighborCellArray.filter(
        callback
      ));
    else return selectedCell.neighborCellArray;
  },

  constructor: Grid,
};
