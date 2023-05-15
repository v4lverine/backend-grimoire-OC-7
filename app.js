require('dotenv').config(); //charge environnement .env

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

app.use(express.json());

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

app.use('/api/books', booksRoutes); //pour créer la route de l'app avec les URL qui suivront selon la route
app.use('/api/auth', userRoutes);

module.exports = app;