const express = require('express');
var cors = require('cors')
const config = require('config');
const path = require('path');
const Offer = require('./models/Offer');

const PORT = process.env.PORT || config.get('SERVER.PORT');



const app = express();
app.use(cors());

  // Serve any static files.
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  // Answer API requests.
  app.get('/api/offers', (req, res, next) => {
    const offer = new Offer(req.query);
    offer.fetch()
      .then(data => {
        res.set('Content-Type', 'application/json');
        res.send(data);
      })
      .catch((error) => {
        console.error(error);
        if (error.validation) {
          res.status(400);
        } else {
          res.status(503);
        }
        res.set('Content-Type', 'application/json');
        res.send({error});
      })
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Node server listening on port ${PORT}`);
    });
  }

  module.exports = app;
