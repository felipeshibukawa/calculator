const buttons = document.querySelectorAll('button');

function createNode(options) {
    const { tag, classNames, content, htmlContent } = options;
    const element = document.createElement(tag);
  
    if (classNames) {
      if (Array.isArray(classNames)) {
        classNames.forEach(className => element.classList.add(className));
      } else {
        element.classList.add(classNames);
      }
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

const buttonList = ["AC","<<","%","÷","7","8","9","X","4","5","6","-","1","2","3","+","0",".","+/-","="]
  
const elementList = [
{
    tag: 'div',
    classNames: 'display',
    content: '0'
}
];

createAndAppendNodes(elementList);
createAndAppendButton(buttonList)
