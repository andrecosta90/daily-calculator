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
];

const SIGNAL = [
    'signal'
];

const BACKSPACE = [
    'Backspace'
];

const DOT = [
    '.', ','
];

const CLEAR_KEYS = [
    'Escape', 'clear'
];

const VALID_KEYS = NUMBERS.concat(
    OPERATORS, BACKSPACE, CLEAR_KEYS,
    EQUAL, PERCENTAGE, DOT
);

let calculator = new Calculator;

// calculator states
let prevCalculationRes = NaN;
let resultArray = [];
let operatorPressed = [false];
let dotPressed = false;
let percentagePressed = false;

function simpleParser(expression) {
    return (expression.split(/([+*/]|\b\-)/g));
}

function percentageToDecimal(value) {
    return roundLongDecimals(parseFloat(value) / 100);
}

function complexParser(exp) {
    let [a, op, b] = (simpleParser(exp)).map((item) => item.trim());

    if (a.includes('%')) {
        a = percentageToDecimal(a);
    }

    if (b !== undefined && b.includes('%')) {
        if (['+', '-'].includes(op)) {
            b = (calculator.operate(`1 ${op} ${percentageToDecimal(b)}`)).toString();
            op = '*';
        } else {
            b = (percentageToDecimal(b)).toString();
        }
    }

    return [a, op, b];
}

function clear(resultDisplayElement, previewDisplayElement) {
    resultArray = [];
    operatorPressed = [false];
    resultDisplayElement.textContent = '';
    previewDisplayElement.textContent = '';
    dotPressed = false;
    percentagePressed = false;

}

function handleInputValue(value) {
    if (NUMBERS.concat(DOT, PERCENTAGE).includes(value)) {
        operatorPressed.push(false);

        const lastElement = parseFloat(resultArray[resultArray.length-1]);

        if (
            NUMBERS.includes(value)
            || (DOT.includes(value) && !dotPressed)
            || (PERCENTAGE.includes(value) && !percentagePressed && !isNaN(lastElement))
        ) {
            resultArray.push(value);
        }

        if (DOT.includes(value) && !dotPressed) {
            dotPressed = !dotPressed;
        }

        if (PERCENTAGE.includes(value) && !percentagePressed && !isNaN(lastElement)) {
            percentagePressed = !percentagePressed;
        }

    } else if (resultArray.length > 0) {

        if (OPERATORS.includes(value) && !operatorPressed[operatorPressed.length - 1]) {
            dotPressed = false;
            percentagePressed = false;
            operatorPressed.push(!operatorPressed[operatorPressed.length - 1]);
            resultArray.push(value);
        } else if (OPERATORS.includes(value) && operatorPressed[operatorPressed.length - 1]) {
            dotPressed = false;
            percentagePressed = false;
            resultArray[resultArray.length - 1] = value;
        }
    }

    if (SIGNAL.includes(value)) {

        const lastElementIndex = resultArray.findIndex(
            item => OPERATORS.includes(item)) + 1;
        const lastElement = parseFloat(resultArray[lastElementIndex]);

        if (!isNaN(lastElement)) {
            resultArray[lastElementIndex] = (-lastElement).toString();
        }
    }
}

function roundLongDecimals(value) {
    return parseFloat(value.toFixed(12)).toString();
}

function sendErrorMessage(message, resultDisplayElement, previewDisplayElement) {
    alert(message);
    clear(resultDisplayElement, previewDisplayElement);
}

function sendValueToScreen(value, resultDisplayElement, previewDisplayElement) {
    // TODO refactor
    if (BACKSPACE.includes(value)) {
        let deletedValue = resultArray.pop();

        if (OPERATORS.concat(DOT).includes(deletedValue)) {
            dotPressed = !dotPressed;
        }

        if (OPERATORS.concat(PERCENTAGE).includes(deletedValue)) {
            percentagePressed = !percentagePressed;
        }
        operatorPressed.pop();
    } else if (CLEAR_KEYS.includes(value)) {
        clear(resultDisplayElement, previewDisplayElement);
    } else if ((EQUAL.concat(OPERATORS)).includes(value) && !isNaN(prevCalculationRes)) {
        [resultDisplayElement.textContent, previewDisplayElement.textContent] = [
            previewDisplayElement.textContent, resultDisplayElement.textContent];

        resultArray = resultDisplayElement.textContent.split("");

        operatorPressed = [false];

        //REFACTOR : DRY
        dotPressed = resultArray.includes('.') ? true : false;
        percentagePressed = resultArray.includes('%') ? true : false;

        handleInputValue(value);

        // return;
    } else {
        handleInputValue(value);
    }

    if (resultArray[0] === '-') {
        resultArray.shift();
        resultArray[0] = -resultArray[0];
    }

    // TODO refactor 
    const aggregatedValue = complexParser(resultArray.join("")).join(" ");

    resultDisplayElement.textContent = aggregatedValue;

    let calculationResult = calculator.operate(aggregatedValue);

    if (aggregatedValue.length > 13 || calculationResult.length > 13) {
        sendErrorMessage(
            "Can't enter more than 13 digits.",
            resultDisplayElement,
            previewDisplayElement
        );
        return;
    }

    if (aggregatedValue.includes('Infinity')) {
        sendErrorMessage(
            "Can't divide by zero.",
            resultDisplayElement,
            previewDisplayElement
        );
        return;
    }

    calculationResult = roundLongDecimals(calculationResult);

    if (!isNaN(calculationResult)) {
        previewDisplayElement.textContent = calculationResult;
    } else {
        previewDisplayElement.textContent = '';
    }

    prevCalculationRes = calculationResult;

    return {
        calculationResult: parseFloat(calculationResult),
        aggregatedValue: parseFloat(aggregatedValue)
    };

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

        value = value === ',' ? '.' : value;
        sendValueToScreen(value, resultDisplayElement, previewDisplayElement);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "/") {
            event.preventDefault();
        }
    });
}

try {

    module.exports = {
        Calculator
        , sendValueToScreen, clear
    };

} catch (e) {

}

try {
    main();
} catch (e) {

}