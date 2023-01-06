let myForm = document.getElementById('myForm');
let textInput = document.getElementById('text_input');
let errorDiv = document.getElementById('error');
let myUl = document.getElementById('list');
let frmLabel = document.getElementById('formLabel');

if (myForm) {
  myForm.addEventListener('submit', (event) => {
    console.log('Form submission fired');
    event.preventDefault();
    console.log('Has a form');
    if (textInput.value.trim()) {
      textInput.classList.remove('inputClass');
      errorDiv.hidden = true;
      frmLabel.classList.remove('error');
      let li = document.createElement('li');

      li.innerHTML = textInput.value;
      myUl.appendChild(li);
      myForm.reset();
      textInput.focus();
    } else {
      textInput.value = '';
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'You must enter a value';
      frmLabel.className = 'error';
      textInput.focus();
      textInput.className = 'inputClass';
    }
  });
}
