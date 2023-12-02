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
    '/', '*', '-', 
    '+', '.', ',',
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

let VALUES = [];
let OPERATOR;

let dotEnabled = false
let dotPressed = false;

function sendValueToScreen(value, result) {
    if (NUMBERS.includes(value)) {
        result.textContent += value;
    } else if (OPERATORS.includes(value)) {
        // VALUES.push(parseFloat(result.textContent));
        OPERATOR = value;
        // result.textContent += ` ${value} `;
        // console.log(`values = ${VALUES}`);
        // console.log(`operator = ${OPERATOR}`);
        result.textContent += value;
    }

    console.log(value);
    // switch (value) {
    //     case 'Escape':
    //     case 'clear':
    //         result.textContent = '';
    //         break;
    //     default:
    //         result.textContent += value;
    // }
    // if (CLEAR_KEYS.includes(value)) {
    //     result.textContent = '';
    // } else {
    //     result.textContent += value;
    // }
}

function main() {
    const buttons = document.querySelector(".buttons");
    const result = document.querySelector(".result");

    buttons.addEventListener("click", (event) => {
        let value = event.target.getAttribute("calc-value");
        // console.log(typeof(value));
        sendValueToScreen(value, result);
    });

    document.addEventListener("keyup", (event) => {
        // console.log(event);
        let value = event.key;
        if (!VALID_KEYS.includes(value)) return;
        // console.log(typeof(value));
        // console.log(`code=${event.code} | key=${event.key}`);
        sendValueToScreen(value, result);
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