function Calculator() {

    this.methods = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
    };

    this.operate = function (expression) {
        let a, b, func;

        const split = expression.split(" ");

        [a, func, b] = split;

        if (!this.methods[func] || split.length > 3) {
            return NaN;
        }

        a = parseFloat(a);
        b = parseFloat(b);

        return (this.methods[func])(a, b);

    }

    this.addMethod = function (name, func) {
        this.methods[name] = func;
    }
}

const NUMBERS = [
    '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9',
];

const OPERATORS = [
    '/', '*', '-', '+'
];

const EQUAL = [
    '=', 'Enter'
];

const PERCENTAGE = [
    '%'
]

const SPECIAL = [
    '.', ',', 'Backspace'
];

const CLEAR_KEYS = [
    'Escape', 'clear'
];

const VALID_KEYS = NUMBERS.concat(
    OPERATORS, SPECIAL, CLEAR_KEYS,
    EQUAL, PERCENTAGE
);

let calculator = new Calculator;
let resultArray = [];

let operatorPressed = [false];

function parser(expression) {
    return (expression.split(/([+\-*/])/g)).join(" ");
}

function sendValueToScreen(value, resultDisplayElement, previewDisplayElement) {

    // TODO refactor
    if (value === "Backspace") {
        resultArray.pop();
        operatorPressed.pop();
    } else {
        if (NUMBERS.includes(value)) {
            operatorPressed.push(false);
            resultArray.push(value);
        } else if (OPERATORS.includes(value) && !operatorPressed[operatorPressed.length - 1]) {
            operatorPressed.push(!operatorPressed[operatorPressed.length - 1]);
            resultArray.push(value);
        } else if (OPERATORS.includes(value) && operatorPressed[operatorPressed.length - 1]) {
            resultArray[resultArray.length - 1] = value;
        }
    }

    // TODO refactor 
    const aggregatedValue = parser(resultArray.join(""));

    resultDisplayElement.textContent = aggregatedValue;

    let calculationResult = calculator.operate(aggregatedValue);
    if (!isNaN(calculationResult)) {
        previewDisplayElement.textContent = calculationResult;
    } else {
        previewDisplayElement.textContent = '';
    }
    // console.log(calculationResult);

}

function main() {
    const buttons = document.querySelector(".buttons");
    const resultDisplayElement = document.querySelector(".result");
    const previewDisplayElement = document.querySelector(".preview");

    buttons.addEventListener("click", (event) => {
        let value = event.target.getAttribute("calc-value");
        sendValueToScreen(value, resultDisplayElement, previewDisplayElement);
    });

    document.addEventListener("keyup", (event) => {
        let value = event.key;
        if (!VALID_KEYS.includes(value)) return;
        sendValueToScreen(value, resultDisplayElement, previewDisplayElement);
    });
}

try {

    module.exports = {
        Calculator
    };

} catch (e) {

}

try {
    main();
} catch (e) {

}