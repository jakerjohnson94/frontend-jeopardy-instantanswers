function JeopardyGrid(rowCount, columnCount, offsets, cellHeight, cellWidth, outputElement) {
  Grid.call(this, rowCount, columnCount, offsets, cellHeight, cellWidth, outputElement);

  this.questionOutput = document.getElementById('questionOutput');
  this.categoryOut = document.getElementById('categoryOut');
  this.textField = document.getElementById('textField');
  this.pointsOut = document.getElementById('points');
  this.apiBaseString = 'https://jservice.io/api/';
  this.categories = {
    0: {
      name: [],
      id: [],
      clues: [],
      answers: [],
    },
  };

  this.categoryCellArray = [];
  this.createCells();
  this.changeSizeOfAllCells(this.cellHeight, this.cellWidth);
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
      }
      this.cellArray[columnIndex].push(cell);

      //cell.element.addEventListener('click', this.boundClickEvent);
    }
  }
};

JeopardyGrid.prototype.fetchRandomCategories = function() {
  fetch(`${this.apiBaseString}/random?count=6`)
    .then(responseObject => responseObject.json())
    .then(obj => {
      console.log(obj);
      for (i = 0; i < obj.length; i++) {
        console.log(this.categories[i]);
        this.categories.name.push(obj[i].category.title);
        this.categories.id.push(obj[i].category.id);
      }
    })
    .then(() => this.getQuestions())
    .then(() => this.populateCategoryCells())
    .then(() => this.populateQuestionCells());
};
JeopardyGrid.prototype.populateCategoryCells = function() {
  for (let i in this.categoryCellArray) {
    const categoryName = document.createElement('p');
    categoryName.textContent = this.categories.names[i];
    this.categoryCellArray[i].element.appendChild(categoryName);
  }
};
JeopardyGrid.prototype.getQuestions = function() {
  for (let i in this.categories.ids) {
    fetch(`${this.apiBaseString}/clues?category=${this.categories.ids[i]}`)
      .then(responseObject => responseObject.json())
      .then(body => {
        for (let i = 0; i < 6; i++) this.categories.questions.clues.push(body[i].question);
        this.categories[i].questions.answers.push(body[i].answer);
      });
  }
};
JeopardyGrid.prototype.populateQuestionCells = function() {
  for (let col of this.cellArray) {
    for (let cell of this.cellArray[col]) {
      const questionName = document.createElement('p');
      questionName.textContent = this.categories.name.pop();
      cell.element.appendChild(questionName);
    }
  }
};

JeopardyGrid.prototype.fetchNewQuestion = function() {
  fetch(`${this.apiBaseString}/random`)
    .then(responseObject => responseObject.json())
    .then(hydratedBody => {
      this.gameQuestion = hydratedBody[0].question;
      this.gameAnswer = hydratedBody[0].answer;
      this.questionOutput.textContent = this.gameQuestion;
      this.gamePoints = hydratedBody[0].value;
      this.categoryOut.textContent = hydratedBody[0].category.title;
    });
};

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
