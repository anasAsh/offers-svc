const request = require('supertest');


const offersConstructor = jest.fn();

const getOffersSuccessFn = jest.fn().mockImplementation(()=> {
  return Promise.resolve({data: 'some data'})
});

const getOffersFailFn = jest.fn().mockImplementation(()=> {
  return Promise.reject({error: 'some data'});
});


const mockOffer = (fn) => {
  jest.doMock('./models/Offer', () => {
    return class {
      constructor(p) {
        offersConstructor(p);
      }
      fetch() {
        return fn();
      }
    }
  });
  
}



describe('offers endpoint', () => {
  beforeEach(() =>  {
    jest.resetModules();
  });

  it('should return data from API and call offers service with query', async (done) => {
    mockOffer(getOffersSuccessFn);
    const app = require('./');
    const res = await request(app)
      .get('/api/offers?abc=123')
      .send();

    expect(offersConstructor).toBeCalledWith({abc: '123'});
    expect(res.body).toEqual({'data': 'some data'});
    expect(res.statusCode).toEqual(200);
    done();
  });

  it('should handle fail', async (done) => {
    mockOffer(getOffersFailFn);
    const app = require('./');
    const res = await request(app)
      .get('/api/offers?abc=123')
      .send();

    expect(res.statusCode).toEqual(503);
    expect(res.body).toEqual({error: {error: 'some data'}});
    done();
  });

})