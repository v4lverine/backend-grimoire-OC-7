const multer = require("multer");

const storage = multer.memoryStorage(); //Img stock in memory
const upload = multer({ storage }); //Loading the image

module.exports = upload.single('image'); //Loads img somewhere, uploads a single img on a storage