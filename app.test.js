import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';
//test test
describe('<App />', () => {
  it('exists', () => {
    const app = renderer.create(<App />).toJSON();
    expect(app).toBe(app);
  });
});