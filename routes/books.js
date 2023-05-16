const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const booksCtrl = require ('../controllers/books')

router.post('/', auth, booksCtrl.createBook); // récupère route avec méthode demandée et donne la suite de l'url selon la donnée à charger
router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
router.get('/bestrating', booksCtrl.getBestRating);
router.put('/:id', auth, booksCtrl.updateOneBook);
router.delete('/:id', auth, booksCtrl.deleteOneBook);
// router.post('/:id/rating', auth, booksCtrl.createRating);

module.exports = router;