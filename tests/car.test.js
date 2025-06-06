const { price } = require('../rentalPrice');

test('3-day rental, Compact, age 30, 10 years of experience, low season', () => {
  const result = price('Tallinn', 'Tartu', '2025-03-01', '2025-03-03', 'compact', 30, 2015);
  expect(result).toBe('$93.00');

});
