const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/jfif': 'jfif', 
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ //comprend deux arguments
    destination: (req, file, callback) => { //endroit dans lequel les images vont être uploadées
        callback(null, 'images');
    },
    filename: (req, file, callback) => { //définit le nv nom de fichier à utiliser pour éviter doublon
        const name = file.originalname.split(' ').join('_'); //remplace espaces par des underscores
        const extension = MIME_TYPES[file.mimetype]; //génère extension du fichier
        callback(null, name + Date.now() + '.' + extension); //créé le filename entier
    }
});

module.exports = multer({storage: storage}).single('image'); //single pour fichier image unique