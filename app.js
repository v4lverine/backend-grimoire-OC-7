require('dotenv').config(); //charge environnement .env

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const path = require('path');

app.use(express.json());

mongoose.connect(process.env.CONNECTION_STRING, //Load DB via key stock in .env file
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established'))
  .catch(() => console.log('MongoDB connection failed'));

  //CORS Headers for multi-origin HTTP requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images'))); //Function to load images into a directory 'images'
app.use('/api/books', booksRoutes); //Creates app routes in order to load URLs
app.use('/api/auth', userRoutes);

module.exports = app;