const gameScoreService = require('./gameScoreService');

test('increment left with null scores', () => {
  const result = gameScoreService.calculate(null, null, 'left', 'increment');
  expect(result.leftTeamScore).toBe(1);
  expect(result.rightTeamScore).toBe(0);
});

test('increment right with null scores', () => {
  const result = gameScoreService.calculate(null, null, 'right', 'increment');
  expect(result.leftTeamScore).toBe(0);
  expect(result.rightTeamScore).toBe(1);
});

test('decrement left with null scores', () => {
  const result = gameScoreService.calculate(null, null, 'left', 'decrement');
  expect(result.leftTeamScore).toBe(0);
  expect(result.rightTeamScore).toBe(0);
});

test('decrement right with null scores', () => {
  const result = gameScoreService.calculate(null, null, 'right', 'decrement');
  expect(result.leftTeamScore).toBe(0);
  expect(result.rightTeamScore).toBe(0);
});


test('increment left with given scores', () => {
  const result1 = gameScoreService.calculate(0, 0, 'left', 'increment');
  expect(result1.leftTeamScore).toBe(1);
  expect(result1.rightTeamScore).toBe(0);

  const result2 = gameScoreService.calculate(3, 1, 'left', 'increment');
  expect(result2.leftTeamScore).toBe(4);
  expect(result2.rightTeamScore).toBe(1);
});

test('increment right with given scores', () => {
  const result1 = gameScoreService.calculate(0, 0, 'right', 'increment');
  expect(result1.leftTeamScore).toBe(0);
  expect(result1.rightTeamScore).toBe(1);

  const result2 = gameScoreService.calculate(3, 1, 'right', 'increment');
  expect(result2.leftTeamScore).toBe(3);
  expect(result2.rightTeamScore).toBe(2);
});

test('decrement left with given scores', () => {
  const result1 = gameScoreService.calculate(0, 0, 'left', 'decrement');
  expect(result1.leftTeamScore).toBe(0);
  expect(result1.rightTeamScore).toBe(0);

  const result2 = gameScoreService.calculate(3, 1, 'left', 'decrement');
  expect(result2.leftTeamScore).toBe(2);
  expect(result2.rightTeamScore).toBe(1);
});

test('decrement right with given scores', () => {
  const result1 = gameScoreService.calculate(0, 0, 'right', 'decrement');
  expect(result1.leftTeamScore).toBe(0);
  expect(result1.rightTeamScore).toBe(0);

  const result2 = gameScoreService.calculate(3, 1, 'right', 'decrement');
  expect(result2.leftTeamScore).toBe(3);
  expect(result2.rightTeamScore).toBe(0);
});

