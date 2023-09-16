const jwt = require('jsonwebtoken')
const User = require('../model/user');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secret')
        console.log('user----', user.userId)
        User.findByPk(user.userId)
        .then(user => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch (err => console.log(err))
    } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    }
}