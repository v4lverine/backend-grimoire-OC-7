require('dotenv').config(); //charge environnement .env

const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const Book = require('./models/Book');

mongoose.connect(process.env.CONNECTION_STRING, //charge la bdd via clé dans .env
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    console.log('middleware at ' + req.url);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// app.post('/api/auth/signup', (req, res, next) => {

// });

// app.post('/api/auth/login', (req, res, next) => {

// });

module.exports = app;