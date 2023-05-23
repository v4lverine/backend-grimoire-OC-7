const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharpImage = require('../middleware/sharp');

const booksCtrl = require ('../controllers/books')

// Routes recovered with requested method (GET, POST, PUT, DELETE) + controllers according to needs
router.post('/', auth, multer, sharpImage, booksCtrl.createBook);
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer, sharpImage, booksCtrl.updateOneBook);
router.delete('/:id', auth, booksCtrl.deleteOneBook);
router.post('/:id/rating', auth, booksCtrl.createRating);

module.exports = router;