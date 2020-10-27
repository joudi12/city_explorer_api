let express = require('express');
let app = express();
let cors = require('cors');
let pg = require('pg');
let superagent = require('superagent');

app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TRAIL_API_KEY = process.env.TRAIL_API_KEY;



const DATABASE_URL = process.env.DATABASE_URL;


app.get('/location', handelLocation);
function handelLocation(req, res) {

  let city = req.query.city;

  let database = 'SELECT search_query, formatted_query,latitude,longitude FROM city WHERE search_query = $1 ';
  let val = [city];
  client.query(database, val).then((data) => {
    if (data.rowCount !== 0) {
      res.send(data.rows[0]);
      console.log(data.rows);
    } else {

      superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`)
        .then((data) => {
          let jasonobject = data.body[0];

          let newlocation = new Location(city, jasonobject.display_name, jasonobject.lat, jasonobject.lon);
          res.status(200).json(newlocation);
         client.query(`INSERT INTO city (search_query,formatted_query, latitude, longitude) VALUES ('${newlocation.search_query}','${newlocation.formatted_query}','${newlocation.latitude}','${newlocation.longitude}')`).then();
   
        }).catch(() => {

          res.status(500).send('Sorry, something went wrong');
        });
    }


  });
  // if (city === 'SELECT * FROM city;'){
  // client.query('SELECT * FROM city;').then(data => {
  //   res.send(data.row);

  // }).catch(()=>{
  //   res.send('try again ');
  // });


  // let jasondata = require('./data/location.json');


  //   } catch (error) {
  //     res.status(500).send('Sorry, something went wrong');
  //   }


}

function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}



app.get('/weather', handelweather);
function handelweather(req, res) {


  // let jasondata = require('./data/weather.json');
  let city = req.query.search_query;

  //   let lat =req.query.jasonobject.lat;
  //   let lon =req.query.jasonobject.lon;

  superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHER_API_KEY}
    `).then((val) => {
    let jasonobject = val.body.data;

    let arr = jasonobject.map((value) => {
      return new Weather(value.weather.description, value.datetime);

    });
    // console.log(arr);
    res.status(200).send(arr);
  }).catch(() => {
    res.status(500).send('Sorry, something went wrong');
  });



  // let arr = [];

  // for (let i = 0; i < jasonobject.length; i++) {

  //   let newWeather = new Weather(jasonobject[i].weather.description, jasonobject[i].datetime);
  //   arr.push(newWeather);

  // }



}
function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = new Date(time).toDateString();
}

// [
//     {
//       "forecast": "Partly cloudy until afternoon.",
//       "time": "Mon Jan 01 2001"
//     },
//     {
//       "forecast": "Mostly cloudy in the morning.",
//       "time": "Tue Jan 02 2001"
//     },
//     ...
//   ]


let client = new pg.Client(DATABASE_URL);
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log('this is the listen ');
  });
}).catch(err => {
  console.log('sorry there is a problem ', err);
});

app.get('/trails', handeltrails);
function handeltrails(req, res) {





  //   let lat =req.query.jasonobject.lat;
  //   let lon =req.query.jasonobject.lon;

  superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=200&key=${TRAIL_API_KEY}
 
    `).then((val) => {
    let jasonobject = val.body.trails;
    console.log(jasonobject);
    let arr = jasonobject.map((value) => {
      return new Trail(value);

    });
    // console.log(arr);
    res.status(200).send(arr);
  }).catch(() => {
    res.status(500).send('Sorry, something went wrong');
  });
}
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
//   {
//     "name": "Rattlesnake Ledge",
//     "location": "Riverbend, Washington",
//     "length": "4.3",
//     "stars": "4.4",
//     "star_votes": "84",
//     "summary": "An extremely popular out-and-back hike to the viewpoint on Rattlesnake Ledge.",
//     "trail_url": "https://www.hikingproject.com/trail/7021679/rattlesnake-ledge",
//     "conditions": "Dry: The trail is clearly marked and well maintained.",
//     "condition_date": "2018-07-21",
//     "condition_time": "0:00:00 "
//   },
//   {

