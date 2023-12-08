const calculator = require('./calculator');

function runTest(events) {
  const resultDisplayElement = { textContent: '' };
  const previewDisplayElement = { textContent: '' };
  let ret;
  for (evt of events) {
    ret = calculator.sendValueToScreen(evt, resultDisplayElement, previewDisplayElement);
  }
  calculator.clear(resultDisplayElement, previewDisplayElement);
  return ret
}

describe('UI Tests', () => {
  test('adds 5 + 1 to equal 6', () => {
    const events = ['5', '+', '1'];
    let ret = runTest(events);
    expect(
      ret['calculationResult']
    ).toBe(6);
  });

  test('adds 5 + 1 to equal 6 followed by Enter', () => {
    const events = ['5', '+', '1', 'Enter'];
    let ret = runTest(events);
    expect(
      ret['aggregatedValue']
    ).toBe(6);
  });

  test('12 + 7 - 5 * 3 = should yield 42', () => {
    const events = ['1', '2', '+', '7', '-', '5', '*', '3'];
    let ret = runTest(events);
    expect(
      ret['calculationResult']
    ).toBe(42);
  });

  test('12 + 7 - 5 * 3 Followed by Enter => should yield 42', () => {
    const events = ['1', '2', '+', '7', '-', '5', '*', '3', 'Enter'];
    let ret = runTest(events);
    expect(
      ret['aggregatedValue']
    ).toBe(42);
  });


  test('adds 6 - 4 to equal 2', () => {

    const events = ['6', '-', '4'];
    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(2);
  });

  test('adds 13 * 2 to equal 26', () => {


    const events = ['1', '3', '*', '2'];
    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(26);
  });

  test('adds 50 * 2 to equal 25', () => {

    const events = ['5', '0', '/', '2'];
    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(25);
  });

  test('Complex events 1', () => {

    const events = ['5', '+', '-', '*', '/', '*', '-', '*', '+', '2', '2', '2', 'Backspace'];
    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(27);
  });

  test('Complex events 2', () => {
    const events = ['6', '+', '-', '*', '/', '*', '-', '*', '+', '2', '2', '2', 'Backspace', 'Escape', '5', '0',
      'Backspace', '1', '+', '-', '1', '0'];

    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(41);
  });

  test('Complex events 3 : 6-10 = -4', () => {
    const events = ['6', '-', '1', '0'];
    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(-4);
  });

  test('Complex events 3 : 6-10Enter equals to -4', () => {

    const events = ['6', '-', '1', '0', 'Enter'];
    let ret = runTest(events);
    expect(ret['aggregatedValue']).toBe(-4);
  });

  test('Complex events 4', () => {
    const events = ['6', '-', '1', '0', '+', '1'];
    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(-3);
  });

  test('Complex events 5', () => {
    const events = ['6', '-', '1', '0', 'Enter', '+', '1'];
    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(-3);
  });

  test('Complex events 5', () => {
    const events = ['6', '-', '1', '0', 'Enter', '+', '-', '1'];
    let ret = runTest(events);
    expect(ret['calculationResult']).toBe(-5);
  });

  // Test 1: Addition of floating-point numbers
  test('1.5 + 2.5 Enter => should yield 4', () => {
    const events = ['1', '.', '5', '+', '2', '.', '5', 'Enter'];
    let ret = runTest(events);
    expect(ret['aggregatedValue']).toBe(4);
  });

  // Test 2: Subtraction of floating-point numbers
  test('3.8 - 1.2 Enter => should yield 2.6', () => {
    const events = ['3', '.', '8', '-', '1', '.', '2', 'Enter'];
    let ret = runTest(events);

    let diff = Math.abs(ret['aggregatedValue'] - 2.6);

    expect(diff).toBeLessThan(0.001);
  });

  test('2.5 * 2 Enter => should yield 5', () => {
    const events = ['2', '.', '5', '*', '2', 'Enter'];
    let ret = runTest(events);
    expect(ret['aggregatedValue']).toBe(5);
  });

  test('6.4 / 2 Enter => should yield 3.2', () => {
    const events = ['6', '.', '4', '/', '2', 'Enter'];
    let ret = runTest(events);
    expect(ret['aggregatedValue']).toBe(3.2);
  });

  test('2 + 1.5 * 2 Enter => should yield 5', () => {
    const events = ['2', '+', '1', '.', '5', '*', '2', 'Enter'];
    let ret = runTest(events);
    expect(ret['aggregatedValue']).toBe(7);
  });

  test('3 - 1.2 * 2 + 5.5 Enter => should yield 7.1', () => {
    const events = ['3', '-', '1', '.', '2', '*', '2', '+', '5', '.', '5', 'Enter'];
    let ret = runTest(events);
    expect(ret['aggregatedValue']).toBe(9.1);
  });

  test('3 - 34.12 * 2 + 5.5 Enter => should yield -56.74', () => {
    const events = ['3', '-', '1', '.', '.', 'Backspace', 'Backspace', '3', '4', '.', '1', '2', '*', '2', '+', '5', '.', '5', 'Enter'];
    let ret = runTest(events);

    let diff = Math.abs(ret['aggregatedValue'] - (-56.74));
    expect(diff).toBeLessThan(0.001);
  });

  test('1.3 + 1.7 = 3', () => {
    const events = ['1', '.', '3', '+', '1', '.', '6' , 'Enter', 'Backspace', 'Backspace', '.', '1', '+', '1', 'Enter'];
    let ret = runTest(events);

    let diff = Math.abs(ret['aggregatedValue'] - (3.1));
    expect(diff).toBeLessThan(0.001);
  });

  test('1.3 + 1.7 = 3', () => {
    const events = ['1', '.', '3', '+', '1', '.', '7' , 'Enter', '.', '1', '+', '1', 'Enter'];
    let ret = runTest(events);

    let diff = Math.abs(ret['aggregatedValue'] - (4.1));
    expect(diff).toBeLessThan(0.001);
  });


  test('Percentage Test: 1000 + 10% = 1100', () => {
    const events = ['1', '0', '0', '0', '+', '1', '0', '%', 'Enter'];
    let ret = runTest(events);
    expect(ret['aggregatedValue']).toBe(1100);
  });

  test('Percentage Test: 1000 - 4% = 960', () => {
    const events = ['1', '0', '0', '0', '-', '', '4', '%', 'Enter'];
    let ret = runTest(events);
    expect(ret['aggregatedValue']).toBe(960);
  });

});

describe('addition operator', () => {
  // Test Case 1: Addition with positive numbers
  test('adds 7 + 8 to equal 15', () => {
    expect(
      (new calculator.Calculator).operate("7 + 8")
    ).toBe(15);
  });

  // Test Case 2: Addition with negative numbers
  test('adds -10 + -3 to equal -13', () => {
    expect(
      (new calculator.Calculator).operate("-10 + -3")
    ).toBe(-13);
  });

  // Test Case 3: Addition with a mix of positive and negative numbers
  test('adds 15 + -6 to equal 9', () => {
    expect(
      (new calculator.Calculator).operate("15 + -6")
    ).toBe(9);
  });

  // Test Case 4: Addition with decimal numbers
  test('adds 3.5 + 2.5 to equal 6', () => {
    expect(
      (new calculator.Calculator).operate("3.5 + 2.5")
    ).toBe(6);
  });
});

describe('subtraction operator', () => {
  // Test Case 1: Subtraction with positive numbers
  test('subtracts 15 - 7 to equal 8', () => {
    expect(
      (new calculator.Calculator).operate("15 - 7")
    ).toBe(8);
  });

  // Test Case 2: Subtraction with negative numbers
  test('subtracts -5 - -3 to equal -2', () => {
    expect(
      (new calculator.Calculator).operate("-5 - -3")
    ).toBe(-2);
  });

  // Test Case 3: Subtraction with a mix of positive and negative numbers
  test('subtracts 10 - -4 to equal 14', () => {
    expect(
      (new calculator.Calculator).operate("10 - -4")
    ).toBe(14);
  });

  // Test Case 4: Subtraction with decimal numbers
  test('subtracts 5.5 - 2.5 to equal 3', () => {
    expect(
      (new calculator.Calculator).operate("5.5 - 2.5")
    ).toBe(3);
  });

});


describe('multiplication operator', () => {
  // Test Case 1: Multiplication with positive numbers
  test('multiplies 4 * 6 to equal 24', () => {
    expect(
      (new calculator.Calculator).operate("4 * 6")
    ).toBe(24);
  });

  // Test Case 2: Multiplication with negative numbers
  test('multiplies (-3) * (-4) to equal 12', () => {
    expect(
      (new calculator.Calculator).operate("-3 * -4")
    ).toBe(12);
  });

  // Test Case 3: Multiplication with a mix of positive and negative numbers
  test('multiplies 5 * (-2) to equal -10', () => {
    expect(
      (new calculator.Calculator).operate("5 * -2")
    ).toBe(-10);
  });

  // Test Case 4: Multiplication with decimal numbers
  test('multiplies 2.5 * 3 to equal 7.5', () => {
    expect(
      (new calculator.Calculator).operate("2.5 * 3")
    ).toBe(7.5);
  });

});

describe('division operator', () => {
  // Test Case 1: Division with positive numbers
  test('divides 12 / 4 to equal 3', () => {
    expect(
      (new calculator.Calculator).operate("12 / 4")
    ).toBe(3);
  });

  // Test Case 2: Division with negative numbers
  test('divides (-15) / (-3) to equal 5', () => {
    expect(
      (new calculator.Calculator).operate("-15 / -3")
    ).toBe(5);
  });

  // Test Case 3: Division with a mix of positive and negative numbers
  test('divides 20 / (-5) to equal -4', () => {
    expect(
      (new calculator.Calculator).operate("20 / -5")
    ).toBe(-4);
  });

  // Test Case 4: Division with decimal numbers
  test('divides 8.5 / 2 to equal 4.25', () => {
    expect(
      (new calculator.Calculator).operate("8.5 / 2")
    ).toBe(4.25);
  });

  // Test Case 5: Division by zero
  test('divides 10 / 0 and expects Infinity', () => {
    expect((new calculator.Calculator).operate("10 / 0")).toBe(Infinity);
  });

});

describe('edge cases', () => {

  // Test Case 5: Single operand
  test('calculates a single operand "8" and expects NaN', () => {
    expect(isNaN((new calculator.Calculator).operate("8"))).toBe(true);
  });

  // Test Case 6: Invalid expression with multiple operands
  test('tries to calculate an invalid expression "8 9 8" and expects NaN', () => {
    expect(isNaN((new calculator.Calculator).operate("8 9 8"))).toBe(true);
  });

  // Test Case 7: Invalid operator
  test('tries to calculate an expression with an invalid operator "x + 1" and expects NaN', () => {
    expect(isNaN((new calculator.Calculator).operate("x + 1"))).toBe(true);
  });

  // Test Case 8: Invalid parentheses
  test('tries to calculate an expression with mismatched parentheses "1 ( 2" and expects NaN', () => {
    expect(isNaN((new calculator.Calculator).operate("1 ( 2"))).toBe(true);
  });

  // Test Case 9: Addition with multiple operands
  test('calculates "1 + 4 + 3" and expects NaN', () => {
    expect(isNaN((new calculator.Calculator).operate("1 + 4 + 3"))).toBe(true);
  });

  // Test Case 10: Subtraction with an incomplete expression
  test('calculates "3 * 3 - 4" and expects NaN', () => {
    expect(isNaN((new calculator.Calculator).operate("3 * 3 - 4"))).toBe(true);
  });

  // Test Case 11: Multiplication with an incomplete expression
  test('calculates "2 * 2 -" and expects NaN', () => {
    expect(isNaN((new calculator.Calculator).operate("2 * 2 -"))).toBe(true);
  });


});