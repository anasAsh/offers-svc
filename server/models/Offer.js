const config = require('config');
const fetch = require('node-fetch');

const OFFERS_API = config.get('SERVER.OFFERS_API');
const AVAILABLE_PARAMS = [
  'destinationName', 'destinationCity', 'regionIds', //todo: can these be passed together?
  'minTripStartDate', 'maxTripStartDate', //date
  'lengthOfStay', // integer
  'minStarRating', 'maxStarRating', // integer
  'minTotalRate', 'maxTotalRate', // integer
  'minGuestRating', 'maxGuestRating', // integer
  'hotelId',
  'scenario',
  'page',
  'uid',
  'productType',
];

const baseOffersParams = {
  scenario: 'deal-finder',
  page: 'foo',
  uid: 'foo',
  productType: 'Hotel'
};

const VALIDATIONS = [
  {rule: 'required', keys: [
    'scenario',
    'page',
    'uid',
    'productType'
  ]},
  {
    rule: 'oneAtATime', keys: [
      'destinationName', 'destinationCity', 'regionIds'
    ]
  },
  { rule: 'type', type: 'date', keys: [
    'minTripStartDate', 'maxTripStartDate'
  ]},
  { rule: 'type', type: 'number', keys: [
    'lengthOfStay',
    'minStarRating', 'maxStarRating',
    'minTotalRate', 'maxTotalRate',
    'minGuestRating', 'maxGuestRating',
    'hotelId'
  ]},
  {
    rule: 'math', type: 'min', keys: ['minStarRating', 'maxStarRating'], target: 'minStarRating'
  },
  {
    rule: 'math', type: 'min', keys: ['minTotalRate', 'maxTotalRate'], target: 'minTotalRate'
  },
  {
    rule: 'math', type: 'min', keys: ['minGuestRating', 'maxGuestRating'], target: 'minGuestRating'
  },
  {
    rule: 'math', type: 'minDate', keys: ['minTripStartDate', 'maxTripStartDate'], target: 'minTripStartDate'
  }
];

const validationFunctions = {
  required: (obj, details) => {
    const isValid = details.keys.every((key) => typeof obj[key] !== undefined);
    if (!isValid) {
      return `validation:required ${details.keys.join(', ')}`;
    }
  },
  oneAtATime: (obj, details) => {
    const { keys } = details;
    const isValid = keys
      .filter((key) => (typeof obj[key] !== 'undefined'))
      .length < 2;

    if (!isValid) {
      return `validation:oneAtATime ${details.keys.join(', ')}`;
    }

  },
  type: (obj, details) => {
    const { keys, type } = details;
    const isValid = keys
      .every((key) => typeof obj[key] === 'undefined' || typeValidations[type](obj[key]));
    if (!isValid) {
      return `validation:type ${details.keys.join(', ')} should be ${type}`;
    }
  },
  math: (obj, details) => {
    const { keys, type, target} = details;
    const isValid = mathValidations[type](obj, keys, target);
    if (!isValid) {
      return `validation:math ${details.keys.join(', ')} expected ${target} to be ${type}`;
    }
  }
}

const typeValidations = {
  date: (val) => isNaN(val) && !isNaN(Date.parse(val)),
  number: (val) => !isNaN(val)
}

const mathValidations = {
  min: (obj, keys, target) => {
    if (typeof obj[target] === 'undefined') {
      return true;
    }

    return keys
      .filter(key => key != target)
      .map(key => obj[key])
      .filter(val => !isNaN(val))
      .every(val => val > obj[target]);

  },
  minDate: (obj, keys, target) => {
    if (isNaN(Date.parse(obj[target]))) {
      return true;
    }

    const minDateValue = Date.parse(obj[target]);
    return keys
      .filter(key => key != target)
      .map(key => Date.parse(obj[key]))
      .filter(val => !isNaN(val))
      .every(val => val > minDateValue);
  }
}

class Offer {
    constructor(params) {
      // do not allow client to edit baseOfferParams
      this.params = {...(params || {}), ...baseOffersParams};
      this.baseUrl = OFFERS_API;
    }

    valid() {
      const errors = VALIDATIONS
        .reduce((acc, validation) => {
          return [...acc, validationFunctions[validation.rule](this.params, validation)];
        }, [])
        .filter((v) => v);

      if (errors.length) {
        this.errors = errors;
        return false;
      }

      return true;
    }

    cleanFilterParams() {
      return AVAILABLE_PARAMS
        .reduce((acc, key) => {
          const { [key]: val } = this.params;
          if (val) {
            acc[key] = val;
          }
          return acc;
        }, {});
    };

    fetch() {
      if (!this.valid()) {
        return Promise.reject({validation: this.errors.join(', ')});
      }

      const search = this.cleanFilterParams();

      const url = new URL(this.baseUrl);
      url.search = new URLSearchParams(search);
      return fetch(url)
        .then(() => {
          console.warn(res.body);
          return res;
        })
        .then((res) => res.json());

    }

    
}

module.exports = Offer;