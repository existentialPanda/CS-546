// let myP = document.getElementById('myP');

// myP.innerHTML = 'I have been changed';
// let myBtnTwo = document.getElementById('myBtnTwo');
// let myErrorDiv = document.getElementById('error');
// let myDivBtn = document.getElementById('divBtn');
// let divContainer = document.getElementById('container');
// let myUl = document.getElementById('list');

// function btnClick() {
//   if (myP.className == 'myClassOne') {
//     myP.className = 'myClassTwo';
//     myP.innerHTML = 'I am now classTwo';
//   } else {
//     myP.className = 'myClassOne';
//     myP.innerHTML = 'I am now classOne';
//   }
// }

// myBtnTwo.addEventListener('click', () => {
//   myErrorDiv.hidden = !myErrorDiv.hidden;
// });

// myDivBtn.addEventListener('click', () => {
//   let newP = document.createElement('p');
//   newP.className = 'myClassOne';
//   newP.innerHTML = "I'm another P tag";
//   divContainer.appendChild(newP);
// });

// function addItem() {
//   let li = document.createElement('li');
//   li.innerHTML = "I'm a new item";
//   myUl.appendChild(li);
// }

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
      console.log('has a value of....');
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
