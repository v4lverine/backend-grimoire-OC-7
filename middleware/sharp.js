const sharp = require('sharp');
const fs = require('fs')


async function sharpImage (req, res, next) {
    fs.access("./images", (error) => {
      if (error) {
        fs.mkdirSync("./images");
      }
    });
  
  
    const { buffer, originalname } = req.file; // buffer = contenu de l'image
  
    const newName = `${originalname}.webp`;
  
    await sharp(buffer)
      .resize(100)
      .webp({ quality: 20 })
      .toFile("./images/" + newName)
    // const link = `http://localhost:3000/${ref}`;
    return next();
  };

module.exports = sharpImage;