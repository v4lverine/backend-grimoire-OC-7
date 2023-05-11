const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://userBackend:pBYllGzvXwkZc4VN@cluster0.m4hrwkz.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.post('/api/auth/signup', (req, res, next) => {
    
    next();
});

app.post('/api/auth/login', (req, res, next) => {

    next();
});

app.get('/api/books', (req, res, next) => {

  next();
});

app.get('/api/books/bestrating', (req, res, next) => {

    next();
  });

app.get('/api/books/:id', (req, res, next) => {

    next();
});


app.post('/api/books',(req, res, next) => {

    next();
});  

app.put('/api/books/:id',(req, res, next) => {

});

app.delete('/api/books/:id',(req, res, next) => {

  next();
});

app.post('/api/books/:id/rating',(req, res, next) => {

    next();
});

module.exports = app;