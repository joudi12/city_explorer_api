'use strict';

let superagent = require('superagent');

const yelp = {};
let page = 1;
yelp.getDataToYelp = function (req) {

  const YELP_API_KEY = process.env.YELP_API_KEY;
  const numPerPage = 4;
  const start = ((page - 1) * numPerPage + 1);
  page += 1;

  const queryParams = {
    location: req.query.search_query,
    limit: numPerPage,
    offset: start,
  };

  return superagent.get('https://api.yelp.com/v3/businesses/search')
    .query(queryParams)
    .set('Authorization', `Bearer ${YELP_API_KEY}`)
    .then((val) => {
      let jasonobject = val.body.businesses;
      let arr = jasonobject.map((value) => {
        return new Rusturant(value);
      });

      return arr;

    });
};

function Rusturant(rusdata) {
  this.name = rusdata.name;
  this.image_url = rusdata.image_url;
  this.price = rusdata.price;
  this.rating = rusdata.rating;
  this.url = rusdata.url;
}

module.exports = yelp;
