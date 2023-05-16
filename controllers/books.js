const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
    const bookData = JSON.parse(req.body.book)
    delete bookData._id;
    delete bookData._userId;
    const book = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Book saved !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getBestRating = (req, res, next) => {
    Book.find({}).sort({averageRating: -1}).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.updateOneBook = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Book modified !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteOneBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Book deleted !'}))
    .catch(error => res.status(400).json({ error }));
};

// exports.createRating = (req, res, next) => {
//     if (req.body.rating <0 || req.body.rating >5) {
//         res.status(400).json({ message: 'Données non conformes' })
//     }
//     Book.findOne({_id: req.params.id})
//     .then (book => {
//         book.ratings.push(req.body);
//     })
//     .catch(error => res.status(400).json({ error }));
// };