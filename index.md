Now it's time to use `fetch()` to make some GET requests and do something semi-intelligent with the responses.

### :warning: Read the submission guidelines at the bottom of this page first.

### MVP

1.  Review the documentation for [jService, an open "Jeopardy" API](http://jservice.io/). Experiment a little and see what data you can get back.
2.  Use jService when a page loads to retrieve a question and present it to the user. (5 points)
3.  Provide the user an input box for supplying an answer, and a button for making a guess. (5 points)
4.  When the user makes a guess, check if the user-supplied answer is the correct answer.
5.  Award points (based on the "difficulty") to the user if they guess the answer correctly. (5 points)
6.  Load a new question for the user. (5 points)
7.  You do not have to provide a win condition.

### Stretch Goal

1.  Use OOD (Object-Oriented Design) to represent the contestant and a round.

### Epic Mode

1.  Provide the user with a timer and penalize them for not guessing correctly in time.
2.  Only show the contestant one question per difficulty in a given category.
3.  Provide a win condition once all questions in all categories are exhausted.

# Submission Guidelines

1.  Fork this repo and clone it to your machine.
2.  Enable GitHub Pages for your repo.
3.  Add your code, per the instructions above.
4.  Push your completed code to your own repo.
5.  Submit a pull request to the _original_ repo.
6.  On the PR, add a comment with a link to your GitHub Page for your project.
7.  On Canvas, submit a link to your PR.

###

GET https://jservice.io/api/random?count=6`
