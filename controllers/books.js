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

exports.createRating = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            //pour vérifier si l'utilisateur n'a pas déjà noté le livre
            book.ratings.sort(rate => { //trie les notes données au livre
                if (req.auth.userId === rate.userId) { //si l'user correspond a déjà noté...
                    res.status(400).json({ message: "Ce compte a déjà noté ce livre" }) //...message d'erreur
                }
            })
            //les nouvelles données de l'array ratings sont pushées en tant qu'objet dans BDD
            book.ratings.push({
                "userId": req.auth.userId, //la note de l'user en question..
                "grade": req.body.rating    //... sera chargée dans BDD
            });
            // Mise à jour des notes moyennes
            let sum = 0; //initialisation d'une note moyenne
            book.ratings.sort(rate => sum += rate.grade); //tri dans note moyenne initiale
            book.averageRating = sum / book.ratings.length; //calcul de la nouvelle note moyenne (division)

            Book.updateOne({ _id: req.params.id }, book) // recalcul des notes dans BDD après ajout par l'utilisateur
                .then(() => { res.status(201).json(book) })
                .catch((error) => { res.status(401).json({ error }) });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

