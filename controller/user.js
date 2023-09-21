const User  = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const postUser = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const existingUser = await User.findOne({ where: {email: email}})
        if(existingUser){
            res.json({message : "User Already Exist!"})
        }else {
            bcrypt.hash(password, 10, async (err, hash) => {
                  console.log('err', err);
                  await User.create({
                    name: name,
                    email: email, 
                    password: hash
                })
                res.status(201).json({message : "User Signup Successfully!"})
            })
        }
    } catch { err => console.log(err) }
}

// exports.generateToken = (id, name, ispremiumuser) => {
//     return jwt.sign({ userId : id , name : name , ispremiumuser}, 'secret');
// }

const generateToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId : id , name : name , ispremiumuser}, 'secret');
}

const loginUser = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        await User.findAll({ where: {email: email}})
        .then( user => {
            if(user.length > 0){
                bcrypt.compare(password, user[0].password, (err, response) => {
                    if(err){
                        res.status(500).json({message: "Something went wrong"})
                    }
                    if(response === true){
                        res.status(200).json({success: true, message : "login Successfully", userId: user[0].id, token: generateToken(user[0].id, user[0].name, user[0].ispremiumuser) })
                    } else {
                        return res.json({success: false, message: "Password is incorrect"});
                    }
                })
            }else{
                return res.json({message : "Invalid Credentials"});
        }
    }).catch(err => console.log(err))
       
    } catch { err => console.log(err) }
}

module.exports = {
    loginUser,
    postUser,
    generateToken
}