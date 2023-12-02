const calculator = require('./calculator');

test('adds 1 + 2 to equal 3', () => {
  expect(calculator.add(1, 2)).toBe(3);
});

test('multiplies 3 * 4 to equal 12', () => {
    expect(calculator.multiply(3, 4)).toBe(12);
  });