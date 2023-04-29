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
let currentOperator = "";

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

const displayField = document.querySelector(".display");

// Display character limit
let numCount = 0;
const displayLimit = 11;
clearDisplay = false;

defaultDisplay();

function defaultDisplay() {
  displayField.textContent = firstNumber;
  clearDisplay = true;
}

const numbers = document.querySelectorAll(".number");
numbers.forEach((num) => {num.addEventListener('click', (event) => {
  display(event.target.textContent);
  })});


// Allows user to input numbers,
// clears the display after the operator is clicked for readability
function display(number) {
  if (isNaN(firstNumber)) {
    return;
  }

  const firstZeroPress = (clearDisplay && number == "0")

  if (firstZeroPress) {
    if (displayField.textContent.includes(".")) {
      clearDisplay = false;
    } else if (displayField.textContent === "0"){
      return;
    }
  }
  
  //!displayField.textContent.includes(".")

  if (clearDisplay) {
    clear();
    clearDisplay = false;
  }

  if ((numCount < displayLimit)) {
    displayField.textContent += number;
    ++numCount;
  }
}


const clearButton = document.querySelector(".clear");
clearButton.addEventListener('click', clearAll);

function clear() {
  displayField.textContent = "";
  numCount = 0;
}

function clearAll() {
  clear();
  firstNumber = 0;
  currentOperator = "";
  secondNumber = 0;
  defaultDisplay();
}

const operators = document.querySelectorAll(".operator")

operators.forEach((op) => {op.addEventListener('click', (event) => {
  store(event.target.textContent);
})});

// Storing a number and clearing the display,
// so that the next one can be entered,
// while remembering previous calculations
function store(operator) {
  // Second number isn't entered, update the operator
  if (clearDisplay) {
    currentOperator = operator;
    return;
  }
  // If previous values were stored update until cleared.
  if (firstNumber && currentOperator) {
    update();
  } else {
    firstNumber = Number(displayField.textContent);
  }

  // Store the operator after the update
  currentOperator = operator;
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
  // This happens when equal button is pressed without
  // a stored operator
  if (clearDisplay || !currentOperator) {
    return;
  }

  secondNumber = Number(displayField.textContent);
  firstNumber = format(operate(firstNumber, secondNumber, currentOperator));
  
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

  // Reset the operator so that the first number could be stored
  currentOperator = "";
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

sign.addEventListener('click', displayNegate)

// Negates the number
function displayNegate() {
  if (displayField.textContent.includes("-")) {
    displayField.textContent = displayField.textContent.slice(1);
  } else {
    displayField.textContent = "-" + displayField.textContent;
  }

  // Change the sign of the result
  // When operator is pressed treat negation as the second number 
  // (this functionality is the same as the ms windows calculator)
  if (!currentOperator) {
    firstNumber = -firstNumber;
  } else {
    clearDisplay = false;
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

// Keyboard support
// Changing background color when pressed, improves visibility and UX
document.addEventListener('keydown', (event) => {
  const operatorString = "+-*/";
  let operatorKeyboard = "";
  const equalsString = "=Enter";

  if (event.code.startsWith("Digit") && !event.shiftKey) {
    display(event.key);
    numbers.forEach((num) => {
      if (event.key == num.textContent) {
        num.style.backgroundColor = "#b1b1b9";
      }
    });
  } else if (operatorString.indexOf(event.key) !== -1) {
    operators.forEach((op) => {
      if (op.textContent == "x") {
        operatorKeyboard = operatorString.slice(-2,-1);
      } else if (op.textContent == "÷") {
        operatorKeyboard = operatorString.slice(-1);
      } else {
        operatorKeyboard = op.textContent;
      };
      if (event.key == operatorKeyboard) {
        op.style.backgroundColor = "#565399";
        store(op.textContent);
      }
    });
    if (event.code === "Slash") {event.preventDefault()};
  } else if (event.code === "Equal" || event.code === "Enter"  && !event.shiftKey) {
    update();
    equals.style.backgroundColor = "#00755e";
    if (event.code === "Enter") event.preventDefault();
  } else if (event.code === "Period") {
    displayDecimal();
    dot.style.backgroundColor = "#00755e";
  } else if (event.code === "Minus" && event.shiftKey) {
    displayNegate();
    sign.style.backgroundColor = "#00755e";
  } else if (event.code === "Backspace") {
    deleteCharDisplay();
    del.style.backgroundColor = "#fac192";
  } else if (event.code === "Delete") {
    clearAll();
    clearButton.style.backgroundColor = "#fac192";
  }
  // if (event.key !== "Shift") {
  // console.log(event);
  // }
});

// Reverting the background color when pressed, improves visibility and UX
// This handles shift key differently than keydown
document.addEventListener('keyup', (event) => {
  console.log(event);

  const operatorString = "+-*/";
  let operatorKeyboard = "";
  const equalsString = "=Enter";

  if (event.code.startsWith("Digit")) {
    numbers.forEach((num) => {
      if (event.code.slice(-1) == num.textContent) {
        num.style.backgroundColor = "#e9e9ed";
      }
    });
  } else if ((operatorString.indexOf(event.key) !== -1) || event.key === "Shift") {
    operators.forEach((op) => {
      if (op.textContent == "x") {
        operatorKeyboard = operatorString.slice(-2,-1);
      if (event.code === "Digit8") {op.style.backgroundColor = "#908aff"};
      } else if (op.textContent == "÷") {
        operatorKeyboard = operatorString.slice(-1);
      if (event.code === "Slash") {op.style.backgroundColor = "#908aff"};
      } else if (op.textContent == "+") {
        operatorKeyboard = operatorString.slice(0,1);
        if (event.key === "Shift") {op.style.backgroundColor = "#908aff"};
      } else {
        operatorKeyboard = operatorString.slice(1, 2);
        if (event.code === "Minus") {op.style.backgroundColor = "#908aff"};
      }
      if (event.key == operatorKeyboard) {
        op.style.backgroundColor = "#908aff";
        store(op.textContent);
      }
    });
    if (event.code === "Slash") {event.preventDefault()};
  } else if (event.code === "Equal" || event.code === "Enter"  && !event.shiftKey) {
    equals.style.backgroundColor = "#00c39d";
    if (event.code === "Enter") event.preventDefault();
  } else if (event.code === "Period") {
    dot.style.backgroundColor = "#00c39d";
  } else if (event.code === "Minus") {
    sign.style.backgroundColor = "#00c39d";
  } else if (event.code === "Backspace") {
    del.style.backgroundColor = "#00c39d";
  } else if (event.code === "Delete") {
    clearButton.style.backgroundColor = "#f48225";
  }
});