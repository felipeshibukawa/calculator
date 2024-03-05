const buttonList = ["AC","<<","%","÷","7","8","9","x","4","5","6","-","1","2","3","+","0",".","+/-","="]
const elementList = [{tag: 'div', id: 'previousDisplay', content: '50 + 658'},
{ tag: 'div', id: 'display', content: '0'}];

createAndAppendNodes(elementList);
createAndAppendButton(buttonList);

const buttons = document.querySelectorAll('button');

let firstNumber = null;
let operator;
let lastNumber = null;
let oldLastNumber;
let accumulator = null;
let oldAcummulator = null;
let result;
let equalClicked = false;
let useAccumulator = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonId = button.id;
        switch (buttonId) {
            case 'AC':
                console.log('CLEAR');
                break;
            case '=':
                console.log('vc apertou ' + buttonId + "\noperador: " + operator)
                operate();
                equalClicked = true;
                updateDisplay();
                console.log('\nfirstNumber: ' + firstNumber +
            ' \nlastNumber: ' + lastNumber + '\naccumulator: ' + accumulator + "\noldAcc: " + oldAcummulator)
                break;
            case '+':
                console.log('vc apertou ' + buttonId)
                operator = '+';
                updateDisplay()
                break;
            case '-':
                console.log('vc apertou ' + buttonId)
                operator = '-';
                updateDisplay()
                break;
            case 'x':
                console.log('vc apertou ' + buttonId)
                operator = '*';
                updateDisplay()
                break;
            case '÷':
                console.log('vc apertou ' + buttonId)
                operator = '/';
                updateDisplay()
                break;
            case '%':
                operator = '%'
                break;
            case '<<':
                console.log('ainda terá uma função')
                break;
            case '+/-':
                
                break;
            case '.':

                break;
            default:
                getNumber(buttonId);
                updateDisplay()
                console.log('default')
        }

    });
});

function getNumber(n) {
    if (!firstNumber) {
        firstNumber = n;
    } else if (firstNumber && !operator) {
        firstNumber = firstNumber + n;
    } else if (operator && !lastNumber) {
        lastNumber = n;
    } else if (operator && lastNumber) {
        lastNumber = lastNumber + n;
    }
}

function operate() {
    let parsedFirstNumber = parseInt(firstNumber);
    let parsedlastNumber = parseInt(lastNumber);
    oldAcummulator = accumulator;

    if (accumulator) {
        switch (operator) {
            case '+':
                result = add(accumulator, parsedlastNumber);
                accumulator = result;
                console.log('voce acabou de operar um ' + operator);
                break;
            case '-':
                result = subtract(accumulator, parsedlastNumber);
                accumulator = result;
                break;
            case '*':
                result = multiply(accumulator, parsedlastNumber);
                accumulator = result;
                break;
            case '/':
                result = divide(accumulator, parsedlastNumber);
                accumulator = result;
                break;
            case '%':
                result = percent(accumulator, parsedlastNumber);
                accumulator = result;
                break;
            default:
                console.log('default do operate c acc');
        }
    }

    if (!accumulator) {
        switch (operator) {
            case '+':
                result = add(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                console.log('voce acabou de operar um ' + operator);
                break;
            case '-':
                result = subtract(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
            case '*':
                result = multiply(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
            case '/':
                result = divide(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
            case '%':
                result = percent(parsedFirstNumber, parsedlastNumber);
                accumulator = result;
                break;
            default:
                console.log('default do operate');
        }
    }
    oldLastNumber = lastNumber;
    lastNumber = null;

}

function updateDisplay() {
    const display = document.getElementById("display");
    const previousDisplay = document.getElementById("previousDisplay");

    if (!operator) {
        display.textContent = firstNumber || '0';
        previousDisplay.textContent = ''; // Limpa o previousDisplay
    } else if (!lastNumber && !oldLastNumber) {
        display.textContent = firstNumber + " " + operator;
    } else if (!accumulator && !oldLastNumber) { 
        display.textContent = firstNumber + " " + operator + " " + lastNumber;
        console.log(3)
    } else if (equalClicked === true && !useAccumulator) {
        display.textContent = result;
        previousDisplay.textContent = firstNumber + " " + operator + " " + oldLastNumber + " =";
        useAccumulator = true;
        console.log(4)
    } else {
        display.textContent = accumulator + (lastNumber ? " " + operator + " " + lastNumber : '');
        previousDisplay.textContent = (oldAcummulator ? oldAcummulator : firstNumber) + " " + operator + " " + oldLastNumber + " =";
        console.log(5)
    }
}

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

// UI functions

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