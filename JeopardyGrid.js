function JeopardyGrid(rowCount, columnCount, offsets, cellHeight, cellWidth, outputElement) {
  Grid.call(this, rowCount, columnCount, offsets, cellHeight, cellWidth, outputElement);

  this.questionOutput = document.getElementById('questionOutput');
  this.categoryOut = document.getElementById('categoryOut');
  this.textField = document.getElementById('textField');
  this.pointsOut = document.getElementById('points');
  this.apiBaseString = 'https://jservice.io/api/';
  this.categories = [];
  this.randomCategories = [];
  this.categoryCellArray = [];
  this.createCells();
  this.fetchRandomCategories();
}

JeopardyGrid.prototype = Object.create(Grid.prototype);
JeopardyGrid.prototype.constructor = Grid;

JeopardyGrid.prototype.createCells = function() {
  this.cellArray = [];
  for (let columnIndex = 0; columnIndex < this.rowCount; columnIndex++) {
    const colElement = document.createElement('div');
    this.outputElement.appendChild(colElement);
    colElement.classList.add('gridCol');
    this.cellArray.push([]);
    for (let rowIndex = 0; rowIndex < this.columnCount; rowIndex++) {
      const cell = new JeopardyCell(rowIndex, columnIndex);

      colElement.appendChild(cell.element);
      if (cell.element.dataset.rowIndex === '0') {
        this.categoryCellArray.push(cell);
        cell.element.classList.add('top__row');
        cell.isTopRow = true;
      }
      this.cellArray[columnIndex].push(cell);
    }
  }
  this.changeSizeOfAllCells(this.cellHeight, this.cellWidth);
};

JeopardyGrid.prototype.fetchRandomCategories = function() {
  fetch(`${this.apiBaseString}/random?count=6`)
    .then(responseObject => responseObject.json())
    .then(obj => {
      for (let i = 0; i < obj.length; i++) {
        this.randomCategories.push(obj[i]);
      }

      this.getQuestions();
    });
};
JeopardyGrid.prototype.getQuestions = function() {
  const fetches = this.randomCategories.map(category => {
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
  this.populateCategoryCells();
};

JeopardyGrid.prototype.populateCategoryCells = function() {
  for (let col in this.cellArray) {
    for (let i = 0; i < this.cellArray[col].length; i++) {
      if (this.cellArray[col][i].isTopRow) {
        const categoryName = document.createElement('p');
        categoryName.textContent = this.cellArray[col][i].category.title;
        this.cellArray[col][i].element.appendChild(categoryName);
      } else {
        const categoryValue = document.createElement('p');
        console.log(i);
        categoryValue.textContent = this.cellArray[col][i].category.clues[i].value;
        this.cellArray[col][i].element.appendChild(categoryValue);
      }
    }
  }
};

JeopardyGrid.prototype.populateQuestionCells = function() {
  for (let col in this.cellArray) {
    for (let cell of this.cellArray[col]) {
      if (cell.element.dataset.rowIndex !== 0) {
        const questionName = document.createElement('p');
        cell.element.appendChild(questionName);
      }
    }
  }
};

// JeopardyGrid.prototype.fetchNewQuestion = function() {
//   fetch(`${this.apiBaseString}/random`)
//     .then(responseObject => responseObject.json())
//     .then(hydratedBody => {
//       this.gameQuestion = hydratedBody[0].question;
//       this.gameAnswer = hydratedBody[0].answer;
//       this.questionOutput.textContent = this.gameQuestion;
//       this.gamePoints = hydratedBody[0].value;
//       this.categoryOut.textContent = hydratedBody[0].category.title;
//     });
// };
//document.getElementById('newQuestion').addEventListener('click', fetchNewQuestion);
//submitBtn.addEventListener('click', getUserText);
JeopardyGrid.prototype.getUserText = function() {
  this.textValue = this.textField.value;
  console.log(textValue);
  if (textValue.toLowerCase() === gameAnswer.toLowerCase()) {
    alert('correct');
    this.gamePoints += this.gamePoints;
    this.pointsOut.textContent = this.gamePoints;
    this.fetchNewQuestion();
  } else {
    alert('incorrect');
  }
};
