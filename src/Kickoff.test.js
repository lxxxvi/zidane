import React from 'react';
import renderer from 'react-test-renderer';
import MockDate from 'mockdate';
import moment from 'moment';
import Kickoff from './Kickoff';

afterEach(() => {
  MockDate.reset();
});

test("Kickoff", () => {
  const fakeTime = moment('2020-06-12 17:00:00');

  MockDate.set(fakeTime);

  const component = renderer.create(
    <Kickoff time="2020-06-12 18:00:00" />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
