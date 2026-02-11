const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let firstNumber = '';
let operator = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.innerText;

    // Clear
    if (value === 'C') {
      display.value = '';
      firstNumber = '';
      operator = '';
      return;
    }

    // Operator clicked
    if ('+-*/'.includes(value)) {
      firstNumber = display.value;
      operator = value;
      display.value = '';
      return;
    }

    // Equals
    if (value === '=') {
      const secondNumber = display.value;
      display.value = calculate(firstNumber, operator, secondNumber);
      return;
    }

    // Numbers
    display.value += value;
  });
});

function calculate(a, operator, b) {
  a = Number(a);
  b = Number(b);

  if (operator === '+') return a + b;
  if (operator === '-') return a - b;
  if (operator === '*') return a * b;
  if (operator === '/') {
    if (b === 0) return 'Error';
    return a / b;
  }
}
