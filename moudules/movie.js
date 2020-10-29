'use strict';


let superagent = require('superagent');

const movie ={};

module.exports =movie;

movie.getDataToMovie = function(req){
  const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

  return superagent.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${req.query.search_query}`)
    .then((val) => {
      let jasonobject = val.body.results;
      let arr = jasonobject.map((value) => {
        return new Movies(value);
      });
      return arr;
    });
};

function Movies(moviedata) {
  this.title = moviedata.title;
  this.overview = moviedata.overview;
  this.average_votes = moviedata.vote_average;
  this.total_votes = moviedata.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500/${moviedata.poster_path}`;
  this.popularity = moviedata.popularity;
  this.released_on = moviedata.release_date;
}
