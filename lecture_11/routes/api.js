import {Router} from 'express';
const router = Router();
import {makeToDo, finishToDo} from '../data/index.js';
import xss from 'xss';

router.post('/todo', function (request, response) {
  let cleanName = xss(request.body.name);
  let cleanDesc = xss(request.body.description);
  makeToDo(cleanName, cleanDesc);

  // response.json({ success: true, message: request.body.description });
  response.json({success: true, name: cleanName, desc: cleanDesc});
});

router.post('/todo/complete/:id', function (request, response) {
  const updatedData = finishToDo(parseInt(request.params.id));
  response.render('partials/todo_item', {layout: null, ...updatedData});
});

router.post('/todo.html', function (request, response) {
  const newTodo = makeToDo(
    xss(request.body.name),
    xss(request.body.description)
  );

  response.render('partials/todo_item', {layout: null, ...newTodo});
});

export default router;
