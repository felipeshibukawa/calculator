// Constants
const buttonList = ["AC","←","%","÷","7","8","9","x","4","5","6","-","1","2","3","+","0",".","+/-","="]
const elementList = [
    {tag: 'div', id: 'previousDisplay', content: ''},
    {tag: 'div', id: 'display', content: '0'}
];

// Variables
let firstNumber = null;
let operator = null;
let oldOperator;
let lastNumber = null;
let oldLastNumber;
let accumulator = null;
let oldAcummulator = null;
let result;
let equalClicked = false;
let useAccumulator = false;

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
        } else if (firstNumber && !operator && !oldOperator) {
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
    let parsedOldLastNumber = parseFloat(oldLastNumber);
    oldAcummulator = accumulator;

    if (equalClicked) {
        switch (oldOperator) {
            case '+':
                result = add(accumulator, parsedOldLastNumber);
                accumulator = result;
                break;
            case '-':
                result = subtract(accumulator, parsedOldLastNumber);
                accumulator = result;
                break;
            case 'x':
                result = multiply(accumulator, parsedOldLastNumber);
                accumulator = result;
                break;
            case '÷':
                result = divide(accumulator, parsedOldLastNumber);
                accumulator = result;
                break;
            case '%':
                result = percent(accumulator, parsedOldLastNumber);
                accumulator = result;
                break;
        }
    } else if (accumulator != null) {
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
    oldLastNumber = lastNumber ? lastNumber : oldLastNumber;
    lastNumber = null;
    oldOperator = operator ? operator : oldOperator;
    operator = null;
}

function updateDisplay() {
    const display = document.getElementById("display");
    const previousDisplay = document.getElementById("previousDisplay");

    if (operator && !firstNumber) {
        alert("Please pick a number first.");
        operator = null;
    } else if (!operator && !oldOperator) {
        display.textContent = firstNumber || '0';
        previousDisplay.textContent = '';
    } else if (!lastNumber && !oldLastNumber) {
        display.textContent = firstNumber + " " + operator;
    } else if (!accumulator && !oldLastNumber) { 
        display.textContent = firstNumber + " " + operator + " " + lastNumber;
    } else if (!useAccumulator) {
        display.textContent = result;
        previousDisplay.textContent = firstNumber + " " + (oldOperator ? oldOperator : operator)  + " " + oldLastNumber + " =";
        useAccumulator = true;
    } else if (accumulator == 0 && oldAcummulator != null && oldOperator != null) {
        display.textContent = 0;
        previousDisplay.textContent = (oldAcummulator ? oldAcummulator : firstNumber) + " " + (oldOperator ? oldOperator : operator ) + " " + oldLastNumber + " =";
    } else {
        display.textContent = accumulator + (operator ? " " + operator : '') + (lastNumber ? " " + lastNumber : '');
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
    } else if (firstNumber && !operator && !useAccumulator) {
        firstNumber = firstNumber.substring(0, firstNumber.length - 1);
    } else if (operator && !lastNumber && !useAccumulator) {
        operator = null;
    } else if (operator && lastNumber) {
        lastNumber = lastNumber.substring(0, lastNumber.length - 1);
    } else {
        if (accumulator === 0) {
            clear()
        } else if (accumulator < 10) {
            accumulator = 0;
        } else {
            accumulator = Math.floor(accumulator / 10);
        }
    }
}

// EventListeners
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
                    break;
                case '=':
                    operate();
                    break;
                case '-':
                case '+':
                case 'x':
                case '÷':
                case '%':
                    operator = buttonId;
                    break;
                case '←':
                    backspace();
                    break;
                case '+/-':
                    reverseSign();
                    break;
                default:
                    getNumberOrDot(buttonId);
                    break;
            }
            equalClicked = buttonId === '=';
            updateDisplay();
        });
    });

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        switch (key) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '.':
                getNumberOrDot(key);
                break;
            case ',':
                getNumberOrDot('.');
                break;
            case '+':
            case '-':
            case '%':
                operator = key;
                break;
            case '/':
                operator = '÷';
                break;
            case '*':
                operator = 'x';
                break;
            case 'c':
                clear();
                break;
            case 'Backspace':
                backspace();
                break;
            case 'Enter':
            case '\r':
            case '\n':
            case '=':
                if (document.activeElement.id === "=" || document.activeElement.id === "AC") {
                    event.preventDefault();
                    // Removes focus from the '=' button to prevent double-clicking after it has been clicked with the mouse.
                    document.activeElement.blur();
                }
                operate();
                break;
        }
        equalClicked = key === '=' || key === 'Enter';
        updateDisplay();
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