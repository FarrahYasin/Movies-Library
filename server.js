'use strict';
// const port = 3000;
const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json');
const app = express();
const axios = require('axios');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3005;
const URL = process.env.URL;//this is to use it in trendingPage
const APIKEY = process.env.APIKEY;

const URL2 = process.env.URL2;//this for use it in  handleSearch



app.get('/trending', trendingPage);


async function trendingPage(req, res){
   const axiosCallApi = await axios.get(`${URL}?api_key=${APIKEY}`)
   // const axiosCallApi = await axios.get("https://api.themoviedb.org/3/trending/all/day?api_key=f68a5f39bcaebb80be714773fbe6c484")

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


app.get('/search', handleSearch);


function handleSearch(req, res) {
   const searchQuery = req.query.query;
   //  console.log(req.query)
   axios.get(`${URL2}?api_key=${APIKEY}&query=${searchQuery}`).then(result => {
     res.status(200).json(result.data.results)
   }).catch(err => {
     errorHandler(err, req, res)
   })
 }



 app.get('/TV', listTVPage);

 const URL4 = process.env.URL4;//this for use it in  listTVPage

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

 
 
 app.get('/popular', listPopularPage);

 const URL5 = process.env.URL5;  //this for use it in  listPopularPage

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


//  const URL3 = process.env.URL3;//this for use it in  handleReview
//  app.get('/reviews', handleReviews);
//  function handleReviews(req, res) {
//    const movie_id = res.send(req.params.id);
//     console.log(req.query)
//    axios.get(`${URL3}/${movie_id}/reviews?api_key=${APIKEY}`).then(result => {
//      res.status(200).json(result.data.results)
//    }).catch(err => {
//      errorHandler(err, req, res)
//    })
//  }


//  app.get('/farah/:id', (req, res)=>{
//    console.log(req.query.one)
// res.send(req.params.id)

// })




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
   res.send('Welcome to Favorite Page');//write
//    res.end()
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

    app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));