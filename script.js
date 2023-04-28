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
  if (b == 0) {
    return NaN;
  }
  return a / b;
}

let firstNumber = 0;
let secondNumber = 0;
let operator = "";

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

defaultDisplay();

function defaultDisplay() {
  displayField.textContent = firstNumber;
  clearDisplay = true;
}

// Allows user to input numbers,
// clears the display after the operator is clicked for readability
function display(numberClick) {
  if (isNaN(firstNumber)) {
    return;
  }
  if (clearDisplay) {
    clear();  
    clearDisplay = false;
  }
  if (numCount < displayLimit) {
    displayField.textContent += numberClick.target.textContent;
    ++numCount;
  }
}


const clearField = document.querySelector(".clear");
clearField.addEventListener('click', clearAll);

function clear() {
  displayField.textContent = "";
  numCount = 0;
}

function clearAll() {
  clear();
  firstNumber = 0;
  operator = "";
  secondNumber = 0;
  defaultDisplay();
}

const operators = document.querySelectorAll(".operator")

operators.forEach((op) => {op.addEventListener('click', store)});

function getOperator(operatorClick) {
  operator = operatorClick.target.textContent;
}

// Storing a number and clearing the display,
// so that the next one can be entered,
// while remembering previous calculations
function store(operatorClick) {
  // Second number isn't entered, update the operator
  if (clearDisplay) {
    getOperator(operatorClick);
    return;
  }
  // If previous result was calculated update until cleared.
  if (firstNumber) {
    update();
  } else {
    firstNumber = Number(displayField.textContent);
  }

  // Store the operator for the next update
  getOperator(operatorClick);
  clearDisplay = true;
}

const equals = document.querySelector(".equals");

equals.addEventListener("click", update);

const precision = "1e5";
const precisionVal = Number(precision.toString().slice(-1));
const scientificNotationEndChars = 4;

// The result of calculation becomes the first number,
// in order to calculate the result while clicking the operators
function update() {
  if (clearDisplay || !firstNumber) {
    return;
  }

  secondNumber = Number(displayField.textContent);
  firstNumber = format(operate(firstNumber, secondNumber, operator));
  // Limit number to fit to display
  if (firstNumber > Number("1e" + (displayLimit - precisionVal))) {
    displayField.textContent = 
      firstNumber.toExponential(displayLimit - scientificNotationEndChars);
  } else {
    displayField.textContent = firstNumber;
  }

  if (isNaN(firstNumber)) {
    displayField.textContent = "Division by 0";
  }
  clearDisplay = true;
}

// TODO: Decimals, specific number of digits
function format(number) {
  let epsilon = Number(precision);
  return Math.round(number * epsilon) / epsilon;
}

// Bugs:
// equal operator spamming ex. 2x2=4=16=64 and so on
// should be: 2x2=4=8=16=32
// Fixed with clearDisplay return statement;
