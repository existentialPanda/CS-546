(function ($) {
  // Let's start writing AJAX calls!

  let myNewTaskForm = $('#new-item-form'),
    newNameInput = $('#new-task-name'),
    newDecriptionArea = $('#new-task-description'),
    todoArea = $('#todo-area');

  function bindEventsToTodoItem(todoItem) {
    todoItem.find('.finishItem').on('click', function (event) {
      event.preventDefault();
      let currentLink = $(this);
      let currentId = currentLink.data('id');

      let requestConfig = {
        method: 'POST',
        url: '/api/todo/complete/' + currentId,
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        let newElement = $(responseMessage);
        bindEventsToTodoItem(newElement);
        todoItem.replaceWith(newElement);
      });
    });
  }

  todoArea.children().each(function (index, element) {
    bindEventsToTodoItem($(element));
  });

  myNewTaskForm.submit(function (event) {
    event.preventDefault();

    let newName = newNameInput.val();
    let newDescription = newDecriptionArea.val();
    let newContent = $('#new-content');

    if (newName && newDescription) {
      let useJson = true;
      if (useJson) {
        let requestConfig = {
          method: 'POST',
          url: '/api/todo',
          contentType: 'application/json',
          data: JSON.stringify({
            name: newName,
            description: newDescription,
          }),
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          const myDiv = `<div><h4> ${responseMessage.name} </h4><p> ${responseMessage.desc} </p></div><hr/>`;
          newContent.append(myDiv);
          newNameInput.val('');
          newDecriptionArea.val('');
          newNameInput.focus();
        });
      } else {
        let requestConfig = {
          method: 'POST',
          url: '/api/todo.html',
          contentType: 'application/json',
          data: JSON.stringify({
            name: newName,
            description: newDescription,
          }),
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          let newElement = $(responseMessage);
          bindEventsToTodoItem(newElement);

          todoArea.append(newElement);
        });
      }
    }
  });
})(window.jQuery);
