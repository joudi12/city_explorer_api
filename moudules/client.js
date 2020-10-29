'use strict';

const pg = require('pg');

// start up the server after database connect 
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', err => console.log(err));

module.exports = client;
