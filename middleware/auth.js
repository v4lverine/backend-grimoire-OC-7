const jsWebToken = require('jsonwebtoken');

//Verify if user is connected
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsWebToken.verify(token, process.env.API_TOKEN);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
     next();
    } catch(error) {
        res.status(401).json({ error });
    }

}