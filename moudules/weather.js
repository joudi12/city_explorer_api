'use strict';


let superagent = require('superagent');

const weather = {};

module.exports = weather;

weather.getWeatherdata = function (city) {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    
   return superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHER_API_KEY}
    `).then((val) => {
    let jasonobject = val.body.data;
    let arr = jasonobject.map((value) => {
      return new Weather(value.weather.description, value.datetime);
    });
    return arr;

  });
};



function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = new Date(time).toDateString();
}
