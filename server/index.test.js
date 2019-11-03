const request = require('supertest');

const getOffersSuccessFn = jest.fn().mockImplementation(()=> {
  return new Promise((reslove)=>{
    reslove({data: 'some data'});
  })
});

const getOffersFailFn = jest.fn().mockImplementation(()=> {
  return new Promise((reslove, reject)=>{
    reject({error: 'some data'});
  })
});


const mockApi = (fn) => {
  jest.doMock('./api', () => ({
    getOffers(params) {
      return fn(params);
    }
}));
  
}

describe('offers endpoint', () => {
  beforeEach(() =>  {
    jest.resetModules();
  });

  it('should return data from API and call offers service with query', async (done) => {
    mockApi(getOffersSuccessFn);
    const app = require('./');
    const res = await request(app)
      .get('/api/offers?abc=123')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({'data': 'some data'});
    expect(getOffersSuccessFn).toBeCalledWith({abc: '123'});
    done();
  });

  it('should handle fail', async (done) => {
    mockApi(getOffersFailFn);
    const app = require('./');
    const res = await request(app)
      .get('/api/offers?abc=123')
      .send();

    expect(res.statusCode).toEqual(503);
    expect(res.body).toEqual({error: 'Service Unavailable'});
    done();
  });

})