const express = require('express');
const router = express.Router();

const booksCtrl = require ('../controllers/books')

router.post('/', booksCtrl.createBook); // récupère route avec méthode demandée et donne la suite de l'url selon la donnée à charger
router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
router.get('/bestrating', booksCtrl.getBestRating);
router.put('/:id', booksCtrl.updateOneBook);
router.delete('/:id', booksCtrl.deleteOneBook);
// router.post('/:id/rating', booksCtrl.createRating);

module.exports = router;