let express = require('express');
let app = express();
let cors = require('cors');

app.use(cors());
require ('dotenv').config();

app.get('/location' , handelLocation);
function handelLocation (req,res) {
    let city = req.query.city;
    let jasondata = require('./data/location.json');
    let jasonobject = jasondata[0];
    let newlocation = new Location(city, jasonobject.display_name ,jasonobject.lat ,jasonobject.lon);
    res.status(200).json(newlocation);
}
function Location (search_query,formatted_query,latitude,longitude){
    this.search_query =search_query;
    this.formatted_query= formatted_query;
    this.latitude= latitude;
    this.longitude =longitude;
}
// "search_query": "seattle",
// "formatted_query": "Seattle, WA, USA",
// "latitude": "47.606210",
// "longitude": "-122.332071"
// }

const  PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log('this is the listen ');
})

