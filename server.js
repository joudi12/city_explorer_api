'use strict';
// load Enviroment variable from the env file
// application depndencies
// application setup
require('dotenv').config();
let express = require('express');
let app = express();
let cors = require('cors');
app.use(cors());


const PORT = process.env.PORT;





// our dependencies 
const client = require('./moudules/client.js');
const location = require('./moudules/location.js');
const weather = require('./moudules/weather.js');
const trail = require('./moudules/trails.js');
const movie = require('./moudules/movie.js');
const yelp = require('./moudules/yelp.js');



// the handel for the link 
app.get('/location', handelLocation);
app.get('/weather', handelweather);
app.get('/trails', handeltrails);
app.get('/movies', handelmovies);
app.get('/yelp', handelyelp);




//location .............

function handelLocation(req, res) {
  let city = req.query.city;
  location.getLocationData(city)
    .then(rusalt => {
      sendJason(rusalt, res);
    }).catch((err) => {
      res.send(err);
    });

}
// send json function................................................
function sendJason(data, res) {
  res.status(200).json(data);
}

// the weather..................................................

function handelweather(req, res) {
  let city = req.query.search_query;

  weather.getWeatherdata(city, res).then((resalt) => {
    sendJason(resalt, res);
  }).catch(() => {
    res.status(500).send('Sorry, something went wrong');
  });
}

// the trails........................................................................................

function handeltrails(req, res) {
  trail.getTrailsData(req, res).then((rusalt) => {
    sendJason(rusalt, res);
  }).catch(() => {
    res.status(500).send('Sorry, something went wrong');
  });
}



//the movies...................................................................................

function handelmovies(req, res) {
  movie.getDataToMovie(req, res).then((rusalt) => {
    sendJason(rusalt, res);
  }).catch(() => {
    res.status(500).send('Sorry, something went wrong');
  });
}

//the yelp..............................................................................


function handelyelp(req, res) {
  yelp.getDataToYelp(req, res).then((rusalt) => {
    sendJason(rusalt, res);
  }).catch((err) => {
    res.status(500).send(err);
  });
}


//conect and listen.........................................................................
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log('this is the listen ');
  });
}).catch(err => {
  console.log('sorry there is a problem ', err);
});


