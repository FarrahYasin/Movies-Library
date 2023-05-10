'use strict';

const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json');
const app = express();
const axios = require('axios');
require('dotenv').config();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3005;
const APIKEY = process.env.APIKEY;
const URL = process.env.URL;   //this is to use it in trendingPage
const URL2 = process.env.URL2; //this for use it in  handleSearch
const URL4 = process.env.URL4; //this for use it in  listTVPage
const URL5 = process.env.URL5;  //this for use it in  listPopularPage

const pg = require('pg'); // Require the Postgres 
const DBURL=process.env.DBURL;
const client = new pg.Client(DBURL); 
// Create a new Client from the Postgress that will take the database url (configuration url contains server, username, port number, database name)

app.get('/trending', trendingPage);
app.get('/search', handleSearch);
app.get('/TV', listTVPage);
app.get('/popular', listPopularPage);
app.post('/addMovie', handleAddMovie)
app.get('/addMovie', toGetMoviesAdded)


function toGetMoviesAdded(req, res) {//to get movies
  const sql = `select * from movie`;
  client.query(sql).then(data => {
    res.json({
      count: data.rowCount,
      data: data.rows
    })
  }).catch(err => {
    errorHandler(err, req, res);
  })
}

function handleAddMovie(req, res){//to post movies
   const userInput = req.body;
   const sql = `insert into movie(title, release_date, overview,poster_path,comment) values($1, $2, $3, $4,$5) returning *;`
 
   const handleValueFromUser = [userInput.title, userInput.release_date, userInput.overview, userInput.poster_path, userInput.comment];
 
   client.query(sql, handleValueFromUser)
     .then(data => {
     res.status(201).json(data.rows)
         })
    .catch(err => serverError(err, req, res, next)
           )
 }


async function trendingPage(req, res){
   const axiosCallApi = await axios.get(`${URL}?api_key=${APIKEY}`)

   console.log(axiosCallApi.data.results);

   const moviesInfo =  axiosCallApi.data.results.map(item =>
     new TrendingMovie(item.id, item.title, item.release_date, item.poster_path, item.overview) 
           )
         res.status(200).json(moviesInfo)
       }

     function TrendingMovie(id, title, release_date, poster_path, overview){
        this.id = id;
        this.title = title;
        this.release_date=release_date;
        this.poster_path = poster_path;
        this.overview = overview;
        }




function handleSearch(req, res) {
   const searchQuery = req.query.query;
   //  console.log(req.query)
   axios.get(`${URL2}?api_key=${APIKEY}&query=${searchQuery}`).then(result => {
     res.status(200).json(result.data.results)
   }).catch(err => {
     errorHandler(err, req, res)
   })
 }


 async function listTVPage(req, res){
    const axiosCallApiTV = await axios.get(`${URL4}?api_key=${APIKEY}`)
 
    console.log(axiosCallApiTV.data.genres);

    const allTVList =  axiosCallApiTV.data.genres.map(item =>
      new ListTV(item.id, item.name) 
               )
         res.status(200).json(allTVList)
           }

          function ListTV(id, name){
                this.id = id;
                this.name = name
              }

 
 async function listPopularPage(req, res){
    const axiosCallApiPopular = await axios.get(`${URL5}?api_key=${APIKEY}`)
 
    console.log(axiosCallApiPopular.data.results);

  const allPopularList =  axiosCallApiPopular.data.results.map(item =>
      new ListPopular(item.id, item.title) 
       )
       res.status(200).json(allPopularList)
     }

          function ListPopular(id, title){
            this.id = id;
            this.title = title
 }







app.get('/', (req, res) => {//this for Create a route with a method of get
    // Textt() //this to test if there an 500 error
   const newMovie = new Movie(data.title, data.poster_path, data.overview)
    res.json(newMovie);
  });

function Movie(title, poster_path, overview ){//constructor to retreive some data
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

app.get('/favorite', (req, res) => {
   res.send('Welcome to Favorite Page');
   });

  

function notFoundPage(req, res){
 res.status(404).json({
    status: 404,
   responseTxt: 'page not found!'
})
}

app.use(function serverError(err, req, res, next){   
     res.status(500).json({
        status: 500,
       responseTxt: 'Sorry, something went wrong!'
    })
    });

    app.use('*', notFoundPage);
    

   //  app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));
   client.connect().then(() => {
      // console.log(con)
      app.listen(PORT, ()=>{console.log(`Up and running on port ${PORT}`);
   });
   })
   
   