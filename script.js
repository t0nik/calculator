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
    case "x":
      return multiply(first, second);
    case "÷":
      return divide(first, second);
  }
}

const numbers = document.querySelectorAll(".number");
const displayField = document.querySelector(".display");

numbers.forEach((num) => {num.addEventListener('click', display)});

// Display character limit
let numCount = 0;
const displayLimit = 11;
clearDisplay = false;

// Allows user to input numbers,
// clears the display after the operator is clicked for readability
function display(numberClick) {
  if (clearDisplay) {
    clear();
    clearDisplay = false;
  }
  if (numCount < displayLimit) {
    displayField.textContent += numberClick.target.textContent;
    ++numCount;
  }
}

function clear() {
  displayField.textContent = "";
  numCount = 0;
}

const operators = document.querySelectorAll(".operator")

operators.forEach((op) => {op.addEventListener('click', store)});

// Store the first number when clicking the operator,
// so that the next number can be entered
function store(operatorClick) {
  firstNumber = Number(displayField.textContent);
  operator = operatorClick.target.textContent;
  clearDisplay = true;
}

const equals = document.querySelector(".equals");

equals.addEventListener("click", update);

// Update the result of calculation
function update() {
  secondNumber = Number(displayField.textContent);
  displayField.textContent = operate(firstNumber, secondNumber, operator);
}

