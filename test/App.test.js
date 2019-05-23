/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow, mount } from 'enzyme';
import App from '../client/src/App';


configure({ adapter: new Adapter() });

describe('App component', () => {
  it('render 1 <App /> component', () => {
    const component = shallow(<App />);
    expect(component).toHaveLength(1);
  });
});

describe('it renders props correctly', () => {
  it('render 1 <App /> component', () => {
    const component = shallow(<App name="app" />);
    expect(component.instance().props.name).toBe('app');
  });
});

describe('it renders empty div on x button click', () => {
  it('render 1 <App /> component', () => {
    const component = mount(<App />);
    const button = component.find('.xbutton');
    button.simulate('click');
    expect(component.state().rendering).toEqual(false);
  });
});
