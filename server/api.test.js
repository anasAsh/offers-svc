const fetchSuccessFn = jest.fn().mockImplementation(()=> {
  return new Promise((reslove)=>{
    reslove({json: () => ({data: 'some data'})});
  })
});

const fetchFailFn = jest.fn().mockImplementation(()=> {
  return new Promise((reslove, reject)=>{
    reject({error: 'some data'});
  })
});


const mockfetch = (fn) => {
  jest.doMock('node-fetch', () => {
      return (params) => fn(params);
  });
  
}

describe('API::getOffers', () => {
  beforeEach(() =>  {
    jest.clearAllMocks();
  });

  it('should handle empty params', async (done) => {
    mockfetch(fetchSuccessFn);
    const Api = require('./api');
    const response = await Api.getOffers();
    expect(fetchSuccessFn).toHaveBeenNthCalledWith(1, new URL('https://some.api.com/?scenario=deal-finder&page=foo&uid=foo&productType=Hotel'));
    expect(response).toEqual({data: 'some data'});
    
    done();
  });

  it('should clear unavailable params before sending', async (done) => {
    mockfetch(fetchSuccessFn);
    const Api = require('./api');
    const response = await Api.getOffers({someParam: 1});
    expect(fetchSuccessFn).toHaveBeenNthCalledWith(1, new URL('https://some.api.com/?scenario=deal-finder&page=foo&uid=foo&productType=Hotel'));
    expect(response).toEqual({data: 'some data'});
    
    done();
  });

  it('should add available params before sending', async (done) => {
    mockfetch(fetchSuccessFn);
    const Api = require('./api');
    const response = await Api.getOffers({destinationName: 'Amman'});
    expect(fetchSuccessFn).toHaveBeenNthCalledWith(1, new URL('https://some.api.com/?destinationName=Amman&scenario=deal-finder&page=foo&uid=foo&productType=Hotel'));
    expect(response).toEqual({data: 'some data'});
    
    done();
  });
});

describe('API::buildUrl', () => {
    beforeEach(() =>  {
      jest.clearAllMocks();
    });
  
    it('should return URL', () => {
      const Api = require('./api');
      const response = Api.buildUrl('https://some.api.com', {});
      expect(typeof response.href).toEqual('string');
      expect(response).toEqual(new URL('https://some.api.com/?scenario=deal-finder&page=foo&uid=foo&productType=Hotel'));
    });

    it('should add default params', () => {
      const Api = require('./api');
      const response = Api.buildUrl('https://some.api.com', {});
      expect(response).toEqual(new URL('https://some.api.com/?scenario=deal-finder&page=foo&uid=foo&productType=Hotel'));
    });

    it('should clean unavailable params', () => {
      const Api = require('./api');
      const response = Api.buildUrl('https://some.api.com', {randomParam: 1});
      expect(response).toEqual(new URL('https://some.api.com/?scenario=deal-finder&page=foo&uid=foo&productType=Hotel'));
    });

    it('should add available params', () => {
      const Api = require('./api');
      const response = Api.buildUrl('https://some.api.com', {minTotalRate: 1});
      expect(response).toEqual(new URL('https://some.api.com/?minTotalRate=1&scenario=deal-finder&page=foo&uid=foo&productType=Hotel'));
    });

  });
  


describe('API::cleanFilterParams', () => {
  beforeEach(() =>  {
    jest.clearAllMocks();
  });

  it('should return Object', () => {
    const Api = require('./api');
    const response = Api.cleanFilterParams({});
    expect(typeof response).toEqual('object');
  });

  it('should allow only available params', () => {
    const Api = require('./api');
    const response = Api.cleanFilterParams({x: 2, minStarRating: 1, maxStarRating: 2});
    expect(response).toEqual({minStarRating: 1, maxStarRating: 2});
  });

  it('should not allow default params', () => {
    const Api = require('./api');
    const response = Api.cleanFilterParams({scenario: 1});
    expect(response).toEqual({});
  });

});

