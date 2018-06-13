function Cell(rowIndex, columnIndex) {
  this.rowIndex = rowIndex;
  this.columnIndex = columnIndex;

  this.addElement();
}

Cell.prototype = {
  addElement: function() {
    this.element = document.createElement('div');
    this.element.classList.add('cell');
    this.element.dataset.rowIndex = this.rowIndex;
    this.element.dataset.columnIndex = this.columnIndex;
    return this.element;
  },
  updateElementContent: function(content) {
    this.outputElement.textContent = content;
    return this.element;
  },
  changeSize: function(width, height) {
    this.element.style.height = height;
    this.element.style.width = width;
  },
  addClass: function(newClass) {
    this.element.classList.add(newClass);
    return this.element;
  },
  swapClasses: function(oldClass, newClass) {
    this.element.classList.remove(oldClass);
    this.element.classList.add(newClass);
    return this.element;
  },
  addStyle: function(propertyName, value) {
    this.element.style[propertyName] = value;
    return this.element;
  },
  appendCellChild: function(childElement) {
    this.element.appendChild(childElement);
  },
  constructor: Cell,
};
