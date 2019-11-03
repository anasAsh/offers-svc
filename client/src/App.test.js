import React from "react";
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from "./App";

configure({ adapter: new Adapter() });

describe('<App /> component', () => {
    it('should match the snapshot', () => {
      const container = shallow(<App />);
      expect(container.html()).toMatchSnapshot();
    });
  });