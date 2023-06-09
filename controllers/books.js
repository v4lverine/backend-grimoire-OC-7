const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res) => {
    const bookData = JSON.parse(req.body.book)
    delete bookData._id;
    delete bookData._userId;
    const book = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.generatedName}`, 
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Book saved !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getBestRating = (req, res) => {
    Book.find({}).sort({averageRating: -1}).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.updateOneBook = (req, res) => {
    const bookData = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.generatedName}`
    } : {...req.body };

    delete bookData._userId;
    Book.findOne({_id: req.params.id})
        .then ((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message:'Unauthorized request' });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookData, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Book modified !'}))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteOneBook = (req, res) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Book deleted !'}))
                    .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.createRating = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            //Check if logged user has not already rated this book
            if (book.ratings.find(rate => rate.userId === req.auth.userId)) {
                res.status(400).json({ message: "Ce compte a déjà noté ce livre" })
                return
            }

            //Grade limitation
            if (req.body.rating <1 || req.body.rating >5) {
                res.status(400).json({ message: "La note doit être entre 1 et 5" })
                return
            }

            //New rating datas are pushed as objects in DB
            book.ratings.push({
                "userId": req.auth.userId, //Logged user's rate
                "grade": req.body.rating  //... pushed in DB
            });

            // Update avg ratings
            let sum = 0; //Variable for avg rate = means to change in time
            book.ratings.forEach(rate => sum += rate.grade); //Select each rate given to the selected book
            book.averageRating = Math.round(sum / book.ratings.length); //Calculation of new avg rate with round

            Book.updateOne({ _id: req.params.id }, book) // Rates recalculation in DB after new rate given by user
                .then(() => { res.status(201).json(book) })
                .catch((error) => { res.status(401).json({ error }) });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

