let express = require('express');
let app = express();
let cors = require('cors');
let pg = require('pg');

app.use(cors());
require('dotenv').config();


const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.get('/location', handelLocation);
function handelLocation(req, res) {

  try {
    let city = req.query.city;
    let jasondata = require('./data/location.json');
    let jasonobject = jasondata[0];
    let newlocation = new Location(city, jasonobject.display_name, jasonobject.lat, jasonobject.lon);
    res.status(200).json(newlocation);
  } catch (error) {
    res.status(500).send('Sorry, something went wrong');
  }


}

function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}
// "search_query": "seattle",
// "formatted_query": "Seattle, WA, USA",
// "latitude": "47.606210",
// "longitude": "-122.332071"
// }



app.get('/weather', handelweather);
function handelweather(req, res) {
  try {

    let jasondata = require('./data/weather.json');
    let jasonobject = jasondata.data;
    let arr = [];

    for (let i = 0; i < jasonobject.length; i++) {

      let newWeather = new Weather(jasonobject[i].weather.description, jasonobject[i].datetime);
      arr.push(newWeather);

    }


    res.status(200).send(arr);





  } catch (error) {
    res.status(500).send('Sorry, something went wrong');
  }
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
}).catch(err =>{
  console.log('sorry there is a problem ',err);
});


