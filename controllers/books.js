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
                res.status(401).json({ message:'Unauthorized' });
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
                res.status(401).json({ message: 'Unauthorized' });
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

// exports.createRating = (req, res) => {
//     if (req.body.rating <0 || req.body.rating >5) {
//         res.status(400).json({ message: 'Données non conformes' })
//     }
//     Book.findOne({_id: req.params.id})
//     .then (book => {
//         book.ratings.push(req.body);
//     })
//     .catch(error => res.status(400).json({ error }));
// }; 
// un utilisateur unique ne peut plus changer la note une fois mise, vérifier sur tableau ratings que l'user a déjà défini une note
// tenir bestRating à jour selon les notes (recalculer la note selon les notes saisies par les utilisateurs)