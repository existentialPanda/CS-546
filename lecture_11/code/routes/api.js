const express = require('express');
const router = express.Router();
const todoData = require('../data');
const xss = require('xss');

router.post('/todo', function (request, response) {
  let cleanName = xss(request.body.name);
  let cleanDesc = xss(request.body.description);
  todoData.makeToDo(cleanName, cleanDesc);
  response.json({
    success: true,
    name: cleanName,
    desc: cleanDesc,
  });
});

router.post('/todo/complete/:id', function (request, response) {
  const updatedData = todoData.finishToDo(parseInt(request.params.id));
  response.render('partials/todo_item', {layout: null, ...updatedData});
});

router.post('/todo.html', function (request, response) {
  const newTodo = todoData.makeToDo(
    xss(request.body.name),
    xss(request.body.description)
  );

  response.render('partials/todo_item', {layout: null, ...newTodo});
});

module.exports = router;
