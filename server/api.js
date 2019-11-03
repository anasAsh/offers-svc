const config = require('config');
const fetch = require('node-fetch');

const OFFERS_API = config.get('SERVER.OFFERS_API');

const baseOffersParams = {
  scenario: 'deal-finder',
  page: 'foo',
  uid: 'foo',
  productType: 'Hotel'
};

const availableFilterParams = [
  'destinationName', 'destinationCity', 'regionIds', //todo: can these be passed together?
  'minTripStartDate', 'maxTripStartDate', //date
  'lengthOfStay', // integer
  'minStarRating', 'maxStarRating', // integer
  'minTotalRate', 'maxTotalRate', // integer
  'minGuestRating', 'maxGuestRating', // integer
  'hotelId'

  // should not allow client to control these?
  // 'scenario',
  // 'page',
  // 'uid',
  // 'productType',
];


const cleanFilterParams = (params) => {
  return availableFilterParams
    .reduce((acc, key) => {
      if (params[key]) {
        acc[key] = params[key];
      }
      return acc;
    }, {});
};

const buildUrl = (baseUrl, params) => {
  const url = new URL(baseUrl);
  url.search = new URLSearchParams({
    ...cleanFilterParams(params),
    ...baseOffersParams
  }).toString();
  return url;
};

const getOffers = (params) => {
  return fetch(buildUrl(OFFERS_API, params || {}))
    .then(res => res.json());
};

module.exports = {
  getOffers, buildUrl, cleanFilterParams
};