const jeopardyGrid = new JeopardyGrid(
  6,
  6,
  [],
  'calc(100vh/6)',
  'calc(100vh/9)',
  document.getElementById('boardOut')
);

jeopardyGrid.fetchNewQuestion();
