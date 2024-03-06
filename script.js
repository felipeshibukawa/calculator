// Constants
const buttonList = ["AC","←","%","÷","7","8","9","x","4","5","6","-","1","2","3","+","0",".","+/-","="]
const elementList = [
    {tag: 'div', id: 'previousDisplay', content: ''},
    {tag: 'div', id: 'display', content: '0'}
];

// Variables
let firstNumber = null;
let operator;
let oldOperator;
let lastNumber = null;
let oldLastNumber;
let accumulator = null;
let oldAcummulator = null;
let result;
let equalClicked = false;
let useAccumulator = false;
let isDecimal = false;

// UI Functions
function createNode(options) {
    const { tag, id, content, htmlContent } = options;
    const element = document.createElement(tag);

    if (id) {
        element.id = id;
    }
  
    if (htmlContent) {
      element.innerHTML = htmlContent;
    } else if (content) {
      element.textContent = content;
    }
  
    return element;
}

function createButton(content) {
    const element = document.createElement('button');
    const initialBackgroundColor = window.getComputedStyle(element).getPropertyValue('background-color');

    element.textContent = content;
    element.classList.add('button')
    element.id = content;
    
    element.addEventListener('mousedown', () => {
        element.style.backgroundColor = "#a0a0a0";
    });

    element.addEventListener('mouseup', () => {
        element.style.backgroundColor = initialBackgroundColor;
    });

    return element;
}

function createAndAppendNodes(elementList) {
    elementList.forEach(options => {
      const newNode = createNode(options);
      document.getElementById('calculator').appendChild(newNode);
    });
}

function createAndAppendButton(buttonList) {
    buttonList.forEach(buttonContent => {
        const newButton = createButton(buttonContent);
        document.getElementById('calculator').appendChild(newButton)
    })
}

// Calculator Functions
function getNumberOrDot(n) {
    let displayContent = display.textContent;

    if (n !== '.') {
        if (!firstNumber) {
            firstNumber = n;
        } else if (firstNumber && !operator) {
            firstNumber = firstNumber + n;
        } else if (operator && !lastNumber) {
            lastNumber = n;
        } else if (operator && lastNumber) {
            lastNumber = lastNumber + n;
        }
    } else if (!displayContent.includes('.') || displayContent.includes(operator)) {
        if (!firstNumber) {
            firstNumber = '0.';
        } else if (firstNumber && !operator) {
            if (!firstNumber.includes('.')) {
                firstNumber = firstNumber + '.';
            }
        } else if (operator && !lastNumber) {
            lastNumber = '0.'; 
        } else if (operator && lastNumber) {
            if (!lastNumber.includes('.')) {
                lastNumber = lastNumber + '.';
            }
        }
    }
}

function operate() {
    let parsedFirstNumber = parseFloat(firstNumber);
    let parsedlastNumber = parseFloat(lastNumber);
    oldAcummulator = accumulator;

    if (accumulator != null) {
        console.log('entrou no primeiro if do operate')
        switch (operator) {
            case '+':
                result = add(accumulator, parsedlastNumber);
                accumulator = result;
                break;
            case '-':
                result = subtract(accumulator, parsedlastNumber);
                accumulator = result;
                break;
            case 'x':
                result = multiply(accumulator, parsedlastNumber);
                accumulator = result;
                break;
            case '÷':
                result = divide(accumulator, parsedlastNumber);
                accumulator = result;
                break;
            case '%':
                result = percent(accumulator, parsedlastNumber);
                accumulator = result;
                break;
        }
    } else {
        switch (operator) {
            case '+':
                result = add(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
            case '-':
                result = subtract(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
            case 'x':
                result = multiply(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
            case '÷':
                result = divide(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
            case '%':
                result = percent(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
        }
    }

    oldLastNumber = lastNumber;
    lastNumber = null;
    oldOperator = operator;
}

function updateDisplay() {
    const display = document.getElementById("display");
    const previousDisplay = document.getElementById("previousDisplay");

    if (operator && !firstNumber) {
        alert("Please pick a number first.");
        operator = null;
    } else if (!operator) {
        display.textContent = firstNumber || '0';
        previousDisplay.textContent = '';
    } else if (!lastNumber && !oldLastNumber) {
        display.textContent = firstNumber + " " + operator;
    } else if (!accumulator && !oldLastNumber) { 
        display.textContent = firstNumber + " " + operator + " " + lastNumber;
    } else if (equalClicked === true && !useAccumulator) {
        display.textContent = result;
        previousDisplay.textContent = firstNumber + " " + (oldOperator ? oldOperator : operator)  + " " + oldLastNumber + " =";
        useAccumulator = true;
    } else if (accumulator == 0 && oldAcummulator != null && oldOperator != null) {
        display.textContent = 0;
        previousDisplay.textContent = (oldAcummulator ? oldAcummulator : firstNumber) + " " + (oldOperator ? oldOperator : operator ) + " " + oldLastNumber + " =";
    } else {
        display.textContent = accumulator + (lastNumber ? " " + operator + " " + lastNumber : '');
        previousDisplay.textContent = (oldAcummulator ? oldAcummulator : firstNumber) + " " + (oldOperator ? oldOperator : operator ) + " " + oldLastNumber + " =";
    }
}

function clear() {
    firstNumber = null;
    operator = null;
    oldOperator = null;
    lastNumber = null;
    oldLastNumber = null;
    accumulator = null;
    oldAcummulator = null;
    result = 0;
    equalClicked = false;
    useAccumulator = false;
    isDecimal = false;
}

function reverseSign() {
    if (accumulator) {
        accumulator = accumulator.toString();
        if (accumulator.includes('-')) {
            accumulator = accumulator.substring(1);
        } else {
            accumulator = '-' + accumulator;
        }
    } else if (!firstNumber && !operator) {
        firstNumber = '-';
    } else if (firstNumber && !operator) {
        if (firstNumber.includes('-')) {
            firstNumber = firstNumber.substring(1);
        } else {
            firstNumber = '-' + firstNumber;
        }
    } else if (lastNumber && operator) {
        if (lastNumber.includes('-')) {
            lastNumber = lastNumber.substring(1);
        } else {
            lastNumber = '-' + lastNumber;
        }
    } else if (firstNumber && operator) {
        lastNumber = '-';
    } 
}

function backspace() {
    if (!firstNumber) {
    } else if (firstNumber && !operator) {
        firstNumber = firstNumber.substring(0, firstNumber.length - 1);
    } else if (operator && !lastNumber && !equalClicked) {
        operator = null;
    } else if (operator && lastNumber) {
        lastNumber = lastNumber.substring(0, lastNumber.length - 1);
    } else {
        if (accumulator < 10) {
            accumulator = 0;
        } else {
            accumulator = Math.floor(accumulator / 10);
        }
    }
}

// EventListener
document.addEventListener('DOMContentLoaded', () => {
    createAndAppendNodes(elementList);
    createAndAppendButton(buttonList);

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonId = button.id;
            switch (buttonId) {
                case 'AC':
                    clear();
                    updateDisplay();
                    break;
                case '=':
                    operate();
                    equalClicked = true;
                    updateDisplay();
                    break;
                case '-':
                case '+':
                case 'x':
                case '÷':
                case '%':
                    operator = buttonId;
                    updateDisplay();
                    break;
                case '←':
                    backspace();
                    updateDisplay();
                    break;
                case '+/-':
                    reverseSign()
                    updateDisplay()
                    break;
                default:
                    getNumberOrDot(buttonId);
                    updateDisplay()
            }
        });
    });
});

// Arithmetic Operations
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

function percent(a, b) {
    return a * b * 0.01;
}