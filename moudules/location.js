'use strict';

let superagent = require('superagent');
const client = require('./client.js');

// eslint-disable-next-line no-redeclare
const location = {};



location.getLocationData = function (city) {

  return getDataFromDatabase(city).then((rusalt) => {
    if (rusalt.rowCount !== 0) {
      console.log('welcom here...');
      return rusalt.rows[0];
    } else {
      return getDataFromApi(city).then(data => {
        console.log('this is the dad', data);

        addLocationtotheDataBase(data);
        return data;
      });
    }
  });

};

function getDataFromDatabase(city) {
  let database = 'SELECT search_query, formatted_query,latitude,longitude FROM city WHERE search_query = $1 ';
  let val = [city];
  return client.query(database, val).then((rusalt) => {
    return rusalt;

  });
}

function getDataFromApi(city, res) {
  const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
  return superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`)
    .then((data) => {
      console.log('every thing good until now');

      let jasonobject = data.body[0];
      let newlocation = new Location(city, jasonobject.display_name, jasonobject.lat, jasonobject.lon);

      return newlocation;
    }).catch((err) => {
      res.status(500).send(err);
    });
}

function addLocationtotheDataBase(location) {

  client.query(`INSERT INTO city (search_query,formatted_query, latitude, longitude) VALUES ('${location.search_query}','${location.formatted_query}','${location.latitude}','${location.longitude}')`)
    .then(() => {
      console.log('record successfuly addad');
    }).catch(() => {
      console.log('peoblem happen');
    });
}


function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}


module.exports = location;


