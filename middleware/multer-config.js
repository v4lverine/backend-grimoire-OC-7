const multer = require("multer");

const storage = multer.memoryStorage(); //mise en mémoire de l'image
const upload = multer({ storage }); //action de faire un chargement de l'image

module.exports = upload.single('image'); //charge image qqpart, upload sur un storage, single pour fichier image uniqu