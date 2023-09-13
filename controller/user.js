const User  = require('../model/user');

exports.postUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await User.findOne({ where: {email: email}})

        if(existingUser){
            res.json({message : "User Already Exist! (409)"})
        }else {
            const user = await User.create({
                name: name,
                email: email, 
                password: password
            })
            res.status(201).json({userDetails : user})
        }
    } catch { err => console.log(err) }
}