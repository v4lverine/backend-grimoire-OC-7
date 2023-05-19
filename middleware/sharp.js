const sharp = require('sharp');
const fs = require('fs')


async function sharpImage (req, res, next) {
    fs.access('./images', (error) => {
      if (error) {
        fs.mkdirSync('./images');
      }
    });
  
  
    const { buffer, originalname } = req.file; // buffer = image en mémoire
    const splitName = originalname.split('.')

    splitName.pop()//pop = enlève dernier élément

    const imageName = splitName.join('.')
    const newName = `${imageName}.webp`;
  
    req.file.generatedName = newName
    
    await sharp(buffer) //try.. catch
      .resize(1000)
      .webp({ quality: 80 })
      .toFile('./images/' + newName)
    return next();
  };

module.exports = sharpImage; //upload de l'image