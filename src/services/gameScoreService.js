const increment = (value) => {
  return 1 + Number.parseInt(value);
}

const decrement = (value) => {
  return -1 + Number.parseInt(value);
}

const minimumZero = (value) => {
  if (value > 0) {
    return value;
  };

  return 0;
}

const modifyScore = (score, modifier) => {
  if (modifier === 'increment') {
    return increment(score);
  } else if (modifier === 'decrement') {
    return minimumZero(decrement(score));
  }
}

const calculate = (leftTeamScore, rightTeamScore, side, modifier) => {
  let newLeftTeamScore = minimumZero(leftTeamScore);
  let newRightTeamScore = minimumZero(rightTeamScore);

  if (side === 'left') {
    newLeftTeamScore = modifyScore(newLeftTeamScore, modifier);
  } else if (side === 'right') {
    newRightTeamScore = modifyScore(newRightTeamScore, modifier);
  }

  return {
    leftTeamScore: newLeftTeamScore,
    rightTeamScore: newRightTeamScore
  };
}

module.exports = { calculate: calculate };
