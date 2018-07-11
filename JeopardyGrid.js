function JeopardyGrid(rowCount, columnCount, offsets, cellHeight, cellWidth, outputElement) {
  Grid.call(this, rowCount, columnCount, offsets, cellHeight, cellWidth, outputElement);

  this.questionOutput = document.getElementById('questionOutput');
  this.categoryOut = document.getElementById('categoryOut');
  this.textField = document.getElementById('textField');
  this.pointsOut = document.getElementById('points');
  this.apiBaseString = 'https://jservice.io/api/';
  this.cellArray = [];
  this.categories = [];
  this.valueCells = [];
  this.gamePoints = 0;
  this.clickFunction = this.eventListeners.questionCellClick.bind(this);
  this.createCells();
  this.fetchRandomCategories();
  document
    .getElementById('submit')
    .addEventListener('click', this.eventListeners.submitBtnClick.bind(this));
}

JeopardyGrid.prototype = Object.create(Grid.prototype);
JeopardyGrid.prototype.constructor = Grid;

JeopardyGrid.prototype.createCells = function() {
  for (let columnIndex = 0; columnIndex < this.rowCount; columnIndex++) {
    const column = this.newColumn();
    this.cellArray.push(column);
    this.outputElement.appendChild(column.element);
    for (let rowIndex = 0; rowIndex < this.columnCount; rowIndex++) {
      const cell = new JeopardyCell(rowIndex, columnIndex);
      column.element.appendChild(cell.element);
      if (cell.element.dataset.rowIndex === '0') {
        cell.element.classList.add('top__row');
        cell.isTopRow = true;
      }
      this.cellArray[columnIndex].push(cell);
    }
  }
  this.changeSizeOfAllCells(this.cellHeight, this.cellWidth);
};

JeopardyGrid.prototype.fetchRandomCategories = function() {
  const randomCategories = [];
  fetch(`${this.apiBaseString}random?count=12`)
    .then(responseObject => responseObject.json())
    .then(obj => {
      for (let i in obj) {
        randomCategories.push(obj[i]);
      }
      this.assignCategoriesToColumns(randomCategories);
    });
};

JeopardyGrid.prototype.assignCategoriesToColumns = function(randomCategories) {
  const fetches = randomCategories.map(category => {
    const catID = category.category.id;
    return fetch(`${this.apiBaseString}category?id=${catID}`).then(responseObject =>
      responseObject.json()
    );
  });
  Promise.all(fetches).then(bodies => {
    this.categories = bodies;
    this.addCellCategories();
  });
};

JeopardyGrid.prototype.addCellCategories = function() {
  for (let col in this.cellArray) {
    for (let cell of this.cellArray[col]) {
      if (cell.element.dataset.columnIndex === col) {
        cell.category = this.categories[col];
      }
    }
  }
  this.populateCategoryCellText();
};

JeopardyGrid.prototype.populateCategoryCellText = function() {
  const topRowCells = [];
  const valueCells = [];
  for (let col of this.cellArray) {
    topRowCells.push(col.find(cell => cell.isTopRow));
    valueCells.push(col.filter(cell => !cell.isTopRow));
  }
  topRowCells.forEach(cell => {
    const categoryName = document.createElement('span');
    categoryName.textContent = cell.category.title;
    cell.element.appendChild(categoryName);
  });
  this.populateValueCellText(valueCells);
};

JeopardyGrid.prototype.populateValueCellText = function(valueCells) {
  containsHTML = text => /(<.+?>)|(&.{1,6}?;)/.test(text);
  for (let col in valueCells) {
    for (let row in valueCells[col]) {
      const cell = valueCells[col][row];
      cell.textElement = document.createElement('span');
      cell.clue = cell.category.clues[row];

      if (
        (cell.clue.question !== null || cell.clue.question !== undefined) &&
        (cell.clue.answer !== null || cell.clue.answer !== undefined) &&
        !cell.clue.question.containsHTML &&
        !cell.clue.answer.containsHTML
      ) {
        //Api is bad at consistent values. Override them manually.
        switch (cell.element.dataset.rowIndex) {
          case '1':
            cell.clue.value = '200';
            break;
          case '2':
            cell.clue.value = '400';
            break;
          case '3':
            cell.clue.value = '600';
            break;
          case '4':
            cell.clue.value = '800';
            break;
          case '5':
            cell.clue.value = '1000';
            break;
          default:
            throw new Error('failed to load question');
        }
        cell.textElement.textContent = cell.clue.value;
        cell.element.appendChild(cell.textElement);
        cell.element.addEventListener('click', this.clickFunction);
      }
    }
  }
};

JeopardyGrid.prototype.eventListeners = {
  questionCellClick: function(event) {
    const rowIndex = event.currentTarget.dataset.rowIndex;
    const columnIndex = event.currentTarget.dataset.columnIndex;

    this.clickedCell = this.cellArray[columnIndex][rowIndex];
    this.clickedCell.makeCurrentCell(this);

    this.questionOutput.textContent = this.currentClue.question;
    console.log(this.currentClue.answer);
  },
  submitBtnClick: function() {
    this.getUserText();
  },
};

JeopardyGrid.prototype.getUserText = function() {
  let textValue = this.textField.value;

  if (textValue.toLowerCase() === this.clickedCell.clue.answer.toLowerCase()) {
    this.gamePoints += parseInt(this.currentClue.value);
    this.pointsOut.textContent = this.gamePoints;
    this.clickedCell.textElement.textContent = '';
    this.clickedCell.element.removeEventListener('click', this.clickFunction);
    this.clickedCell = null;
    this.questionOutput.textContent = 'CORRECT!';
    this.textField.value = '';
    return true;
  } else {
    this.gamePoints -= this.currentClue.value;
    this.pointsOut.textContent = this.gamePoints;
    this.questionOutput.textContent = 'WRONG!';
    return false;
  }
};
