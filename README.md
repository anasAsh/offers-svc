# expedia-offers-svc
this is a simple Node/React application to consume Expedia's offer service api.

## Running locally:
clone this repo then follow below instructions for server and UI:
```
$ git clone git@github.com:anasAsh/expedia-offers-svc.git
```
### Server:
```
$ cd expedia-offers-svc
$ npm install
$ npm start
```

or use [pm2](https://pm2.keymetrics.io) to enable watch on files changes
```
$ pm2 start server --watch && pm2 logs
```

### clinet
after making sure server is running, run below commands
```
$ cd client/
$ npm install
$ npm start
```


## Demo app
This is the demo app that is deployed using Heroku https://expedia-offers-svc.herokuapp.com/


## Documentation
### Client
when you open the demo you will see a list of filters and an ajax call will automatically trigger to fetch default data with no filters, all responses will be shown in a list as JSON.
when updating a fliter and click on submit, a new ajax call will be triggered to fetch the new data.
### Server
The API gets the filters in query params and pass these to the API request, before passing these filters the server will clear all unavailable params first before passing them.
available filters list:
```
'destinationName' , 'destinationCity', 'regionIds', 'minTripStartDate', 'maxTripStartDate', 'lengthOfStay', 'minStarRating', 'maxStarRating', 'minTotalRate', 'maxTotalRate', 'minGuestRating', 'maxGuestRating', 'hotelId'
```


also, it will pass the default params as the following:
```
scenario: 'deal-finder',
page: 'foo',
uid: 'foo',
productType: 'Hotel'
```

## Testing
both server and client are covered with unit tests using jest.
to run tests on server:
```
$ npm test
```
to run tests on client:
```
$ cd client && npm test
```

## Assumptions
- The user cannot change default params.
- The API should work with/without filters passed.
- did not focus on UI as requested in the task.
- no limit on allowed calls to offers service.


## issues
- no pagination or page info in the response.





