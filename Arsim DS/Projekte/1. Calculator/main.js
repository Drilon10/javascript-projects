const buttons = document.querySelectorAll('button');
const display = document.getElementById('display');

let firstNumber = '';
let operator = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // console.log(button.innerText);

        const value = button.innerText;

        if('+-*/'.includes(value)) {
            firstNumber = display.value;
            operator = value;
            display.value = '';
            return;
        }

        if(value === '=') {
            const secondNumber = display.value;
            display.value = calculate(firstNumber, operator, secondNumber);
            return;
        }

        if(value === 'C') {
            display.value = '';
            firstNumber = '';
            operator = '';
            return;
        }

        else {
            display.value += value;
        }

    })
});

function calculate(a, operator, b) {
    a = Number(a);
    b = Number(b);

    if(operator === '+') return a + b;
    if(operator === '-') return a - b;
    if(operator === '*') return a * b;
    if(operator === '/') {
        if(b === 0) {
            alert('Divide by 0 not possible');
            return;
        }
        else return a / b;
    }
}