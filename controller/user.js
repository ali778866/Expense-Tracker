const User  = require('../model/user');

exports.postUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await User.findOne({ where: {email: email}})

        if(existingUser){
            res.json({message : "User Already Exist!"})
        }else {
            const user = await User.create({
                name: name,
                email: email, 
                password: password
            })
            res.status(201).json({message : "User Signup Successfully!"})
        }
    } catch { err => console.log(err) }
}

exports.loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await User.findOne({ where: {email: email, password: password}})
        if(existingUser){
            res.json({message : "login Successfully"});
        } else{
            res.json({message : "Invalid Credentials"});
        }
    } catch { err => console.log(err) }
}