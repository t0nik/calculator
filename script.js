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
  // If previous values were stored update until cleared.
  if (firstNumber && operator) {
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
// so that user is able to calculate the result,
// while clicking only the operators
function update() {
  if (clearDisplay || !firstNumber || !operator) {
    return;
  }

  secondNumber = Number(displayField.textContent);
  firstNumber = format(operate(firstNumber, secondNumber, operator));
  
  // Convert number to scientific notation, prevents display overflow
  if (Math.abs(firstNumber) > Number("1e" + (displayLimit - precisionVal))) {
    displayField.textContent = 
      firstNumber.toExponential(displayLimit - scientificNotationEndChars);
  } else {
    displayField.textContent = firstNumber;
  }

  if (isNaN(firstNumber)) {
    displayField.textContent = "Division by 0";
  }
  operator = "";
  clearDisplay = true;
}

// Rounds result in order not to overflow the display
function format(number) {
  let epsilon = Number(precision);
  return Math.round(number * epsilon) / epsilon;
}

const dot = document.querySelector(".dot");

dot.addEventListener('click', displayDecimal)

// Adds a decimal point when there isn't any other
function displayDecimal() {
  if (displayField.textContent.includes(".")) {
    return;
  }
  if (firstNumber && clearDisplay) {
    return;
  }
  if (!firstNumber && clearDisplay) {
    clearDisplay = false;
  }
  if (numCount < displayLimit) {
    displayField.textContent += ".";
  }
}

const sign = document.querySelector(".sign");

sign.addEventListener('click', displaySign)

// Negates the number
function displaySign() {
  if (displayField.textContent.includes("-")) {
    displayField.textContent = displayField.textContent.slice(1);
  } else {
    displayField.textContent = "-" + displayField.textContent;
  }
}

const del = document.querySelector(".delete");

del.addEventListener('click', deleteCharDisplay)

// Removes numbers only when inputted by user and
// allowing to remove numbers before clicking the operators
function deleteCharDisplay() {
  if (!numCount || clearDisplay) {
    return
  } else if (numCount === 1) {
    displayField.textContent = 0;
    clearDisplay = true;
    return
  } else if (displayField.textContent.slice(-1) === ".") {
    displayField.textContent = displayField.textContent.slice(0,-1);
    return;
  }
  displayField.textContent = displayField.textContent.slice(0,-1);
  numCount--;
}