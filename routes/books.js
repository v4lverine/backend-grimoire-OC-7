const express = require('express');

const router = express.Router();

app.get('/api/books', (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/books/bestrating', (req, res, next) => {
    Book.find({}).sort({averageRating: -1}).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/books/:id', (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

app.post('/api/books',(req, res, next) => {
    delete req.body._id;
    const book = new Book({
      ...req.body
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
      .catch(error => res.status(400).json({ error }));
});  

app.put('/api/books/:id',(req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

app.delete('/api/books/:id',(req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

// app.post('/api/books/:id/rating',(req, res, next) => {
  
// });

module.exports = router;