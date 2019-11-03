import React from "react";
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Filters from "./Filters";

configure({ adapter: new Adapter() });

describe('<Filters /> component', () => {

    beforeAll(() => {
  
    });
    
    it('should match the snapshot', () => {
      const container = shallow(<Filters />);
      expect(container.html()).toMatchSnapshot();
    });

    it('should call on submit if if submit is clicked', () => {
        const jestFn = jest.fn();
        const container = shallow(<Filters onSubmit={jestFn} />);
        container.update();
        container.find('[type="submit"]').simulate('click');
        expect(jestFn).toHaveBeenCalled();
    });

    it('should call have inputs data in the submit call', async () => {
        const jestFn = jest.fn();
        const container = shallow(<Filters onSubmit={jestFn} />);
        container.update();
        container.find('[name="destinationName"]')
            .props()
            .onChange({ target: { name: 'destinationName', value: 'London' }, persist: () => {} });
        
        expect(container.state()).toEqual({destinationName: 'London'});
    });

});
