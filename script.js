function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

let firstNumber = 0;
let secondNumber = 0;
let operator = 0;

function operate(first, second, operator) {
  switch (operator) {
    case "+":
      return add(first, second);
    case "-":
      return subtract(first, second);
    case "*":
      return multiply(first, second);
    case "/":
      return divide(first, second);
  }
}

const numbers = document.querySelectorAll(".number");
const displayField = document.querySelector(".display");

numbers.forEach((num) => {num.addEventListener('click', display)});

// Display character limit
let numCount = 0;
const displayLimit = 11;

function display(numberClick) {
  if (numCount < displayLimit) {
    displayField.textContent += numberClick.target.textContent;
    ++numCount;
  }
}

