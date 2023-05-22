const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharpImage = require('../middleware/sharp');

const booksCtrl = require ('../controllers/books')

router.post('/', auth, multer, sharpImage, booksCtrl.createBook); // récupère route avec méthode demandée et donne la suite de l'url selon la donnée à charger
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer, sharpImage, booksCtrl.updateOneBook);
router.delete('/:id', auth, booksCtrl.deleteOneBook);
router.post('/:id/rating', auth, booksCtrl.createRating);

module.exports = router;