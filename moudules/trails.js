'use strict';

let superagent = require('superagent');

const trail = {};
module.exports = trail;

trail.getTrailsData = function (req) {
  const TRAIL_API_KEY = process.env.TRAIL_API_KEY;

  return superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=200&key=${TRAIL_API_KEY}`)
    .then((val) => {
      let jasonobject = val.body.trails;
      let arr = jasonobject.map((value) => {
        return new Trail(value);
      });
      return arr;
    });
};

function Trail(traildata) {
  this.name = traildata.name;
  this.location = traildata.location;
  this.length = traildata.length;
  this.stars = traildata.stars;
  this.star_votes = traildata.starVotes;
  this.summary = traildata.summary;
  this.trails_url = traildata.url;
  this.conditions = traildata.conditionStatus;
  this.condition_date = traildata.conditionDate.toString().slice(0, 10);
  this.condition_time = traildata.conditionDate.toString().slice(11, 20);
}



