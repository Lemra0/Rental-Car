const { price } = require('../rentalPrice');

test('3-day rental, Compact, age 30, 10 years of experience, low season', () => {
  const result = price('Tallinn', 'Tartu', '2025-03-01', '2025-03-03', 'compact', 30, 2015);
  expect(result).toBe('$93.00');
});

test('50 y/o driver rents car for 3 weekdays (Mon-Wed) = $150', () => {
  const result = price('Tallinn', 'Tartu', '2025-03-03', '2025-03-05', 'compact', 50, 2000); // Mon-Wed
  expect(result).toBe('$150.00');
});

test('50 y/o driver rents car for Thu-Sat (Fri+Sat are weekends) = $152.50', () => {
  const result = price('Tallinn', 'Tartu', '2025-03-06', '2025-03-08', 'compact', 50, 2000); // Thu-Fri-Sat
  expect(result).toBe('$152.50');
});

