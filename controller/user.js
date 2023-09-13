const User  = require('../model/user');

exports.postUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.create({
            name: name,
            email: email, 
            password: password
        })
        res.status(201).json({userDetails : user})
    } catch { err => console.log(err) }
}