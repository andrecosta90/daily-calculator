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

module.exports = {
    Calculator
};