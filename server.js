'use strict';
const port = 3000;
const express = require('express');
const cors = require('cors');
const data = require('./Movie Data/data.json');
const app = express();

app.use(cors());
app.use(express.json());




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

    app.listen(port, () => console.log(`Up and Running on port 3000`));