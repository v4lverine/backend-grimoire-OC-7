const User = require('../models/User');
const jsWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10) //10-times salt => hash more secured
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès' }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect'});
            }
            res.status(200).json({
                userId: user._id,
                token: jsWebToken.sign( //fonction sign() = chiffre nouveau token
                    { userId: user._id },
                    process.env.API_TOKEN,
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};