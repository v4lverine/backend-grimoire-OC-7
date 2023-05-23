const sharp = require('sharp');
const fs = require('fs')

//Image optimization 
async function sharpImage (req, res, next) {
    fs.access('./images', (error) => {
      if (error) {
        fs.mkdirSync('./images');
      }
    });
  
  
    const { buffer, originalname } = req.file; // buffer = image stock to memory
    const splitName = originalname.split('.')

    splitName.pop()//Remove last element

    const imageName = splitName.join('.')
    const newName = `${imageName}.webp`;
  
    req.file.generatedName = newName
    
    await sharp(buffer)
      .resize(1000)
      .webp({ quality: 80 })
      .toFile('./images/' + newName)
    return next();
  };

module.exports = sharpImage; //Image upload for routes