const baseOffersParams = {
  scenario: 'deal-finder',
  page: 'foo',
  uid: 'foo',
  productType: 'Hotel'
};

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

describe('Offer::constructor', () => {
  beforeEach(() =>  {
    jest.clearAllMocks();
  });

  it('should add default params', () => {
    mockfetch(fetchSuccessFn);
    const Offer = require('./Offer');
    const offer = new Offer();
    
    expect(offer.params).toEqual(baseOffersParams);
  });

  it('should only pass allowed params', async (done) => {
    mockfetch(fetchSuccessFn);
    const Offer = require('./Offer');
    const offer = new Offer({someParam: 1});
    const response = await offer.fetch();
    expect(fetchSuccessFn).toHaveBeenNthCalledWith(1, new URL('https://some.api.com/?scenario=deal-finder&page=foo&uid=foo&productType=Hotel'));
    expect(response).toEqual({data: 'some data'});
    
    done();
  });

  it('should not allow changing default params', () => {
    const Offer = require('./Offer');
    const offer = new Offer({scenario: 2});
    expect(offer.params.scenario).toEqual(baseOffersParams.scenario);
  });

});

describe('Offer::cleanFilterParams', () => {
  beforeEach(() =>  {
    jest.clearAllMocks();
  });

  it('should return Object', () => {
    const Offer = require('./Offer');
    const offer = new Offer({});
    const response = offer.cleanFilterParams();
    expect(typeof response).toEqual('object');
  });

  it('should allow only available params', () => {
    const Offer = require('./Offer');
    const offer = new Offer({x: 2, minStarRating: 1, maxStarRating: 2});
    const response = offer.cleanFilterParams();
    expect(response).toEqual({...baseOffersParams, minStarRating: 1, maxStarRating: 2});
  });

  

});

