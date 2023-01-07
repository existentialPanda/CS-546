(function ($) {
  // Let's start writing AJAX calls!

  let myNewTaskForm = $('#new-item-form'),
    newNameInput = $('#new-task-name'),
    newDecriptionArea = $('#new-task-description'),
    todoArea = $('#todo-area');

  let requestConfig = {
    method: 'GET',
    url: '/api/todo/json',
  };
  $.ajax(requestConfig).then(function (responseMessage) {
    console.log('In first call');
    let newElement = $(responseMessage);
    console.log(newElement);

    let newElements = responseMessage.map((todoItem) => {
      let element = `<div class="row" class="todo-item"><div class="col-sm-12 col-md-8"><h3>${todoItem.title}</h3><p>${todoItem.task}</p>`;

      if (todoItem.notDone)
        element = $(
          `${element}<a class="finishItem" data-id="${todoItem.id}">Finish</a></div></div>`
        );
      else {
        element = $(
          `${element}<em>This task has been completed</em></div></div>`
        );
      }
      bindEventsToTodoItem(element);
      todoArea.append(element);
    });
  });

  function bindEventsToTodoItem(todoItem) {
    todoItem.find('.finishItem').on('click', function (event) {
      event.preventDefault();
      let currentLink = $(this);
      let currentId = currentLink.data('id');

      let requestConfig = {
        method: 'POST',
        url: '/api/todo/complete/json/' + currentId,
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        let data = responseMessage;
        let element = $(
          `<div class="row" class="todo-item"><div class="col-sm-12 col-md-8"><h3>${data.title}</h3><p>${data.task}</p><em>This task has been completed</em></div></div>`
        );

        bindEventsToTodoItem(element);
        todoItem.replaceWith(element);
      });
    });
  }

  myNewTaskForm.submit(function (event) {
    event.preventDefault();

    let newName = newNameInput.val();
    let newDescription = newDecriptionArea.val();

    if (newName && newDescription) {
      let requestConfig = {
        method: 'POST',
        url: '/api/todo/json',
        contentType: 'application/json',
        data: JSON.stringify({
          name: newName,
          description: newDescription,
        }),
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        console.log(responseMessage);

        let element = `<div class="row" class="todo-item"><div class="col-sm-12 col-md-8"><h3>${responseMessage.todo.title}</h3><p>${responseMessage.todo.task}</p>`;

        if (responseMessage.todo.notDone)
          element = $(
            `${element}<a class="finishItem" data-id="${responseMessage.todo.id}">Finish</a></div></div>`
          );
        else {
          element = $(
            `${element}<em>This task has been completed</em></div></div>`
          );
        }
        console.log(element);
        bindEventsToTodoItem(element);
        todoArea.append(element);
        newNameInput.val('');
        newDecriptionArea.val('');
        newNameInput.focus();
      });
    }
  });
})(window.jQuery);
