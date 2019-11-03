import React from "react";
import { shallow, mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Results from "./Results";

configure({ adapter: new Adapter() });

describe('<Results /> component', () => {

  beforeAll(() => {

  });
  
  it('should match the snapshot', () => {
    const container = shallow(<Results />);
    expect(container.html()).toMatchSnapshot();
  });

  it('should have start loading', () => {
    const container = shallow(<Results />);
    expect(container.state('isLoading')).toEqual(true);
  });

  it('should fetch data', async(done) => {
    const fakeData = {
      anything: 1
    }
    const spy = jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeData)
      })
    );
    const container = shallow(<Results />);
    setTimeout(() => {
      container.update();
      const state = container.instance().state;
      expect(state.data).toEqual(fakeData);
      expect(spy).toHaveBeenCalledWith('/api/offers/?');
      done();
    }, 0);
  });

  it('should fetch data with correct filters', async(done) => {
    const fakeData = {
      anything: 1
    }
    const spy = jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeData)
      })
    );
    const filters = {filter1: 'someString'};
    const container = mount(<Results/>);
    container.setProps({filters})
    
    setTimeout(() => {
      container.update();
      const state = container.instance().state;
      expect(container.props().filters).toEqual(filters);
      expect(spy).toHaveBeenCalledWith('/api/offers/?filter1=someString');

      done();
    }, 0);
  });

  it('should render data', async(done) => {
    const fakeData = {
      offers: {Hotel: [{someData: 1}]}
    }
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeData)
      })
    );
    const filters = {filter1: 'someString'};
    const container = mount(<Results/>);
    container.setProps({filters})
    
    setTimeout(() => {
      container.update();
      expect(container.html()).toMatchSnapshot();
      done();
    }, 0);
  });

  it('should handle error', async(done) => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.reject({})
    );
    const container = mount(<Results/>);
    
    setTimeout(() => {
      container.update();
      expect(container.html()).toMatchSnapshot();
      done();
    }, 0);
  });

});

