const Razorpay = require('razorpay');
const Order = require('../model/order')
require('dotenv').config();
const userController = require('./user')

exports.purchasepremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RZP_ID,
            key_secret: process.env.KEY_SECRET
        })
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.log(err);
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderId: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id })
                })
                .catch(err => console.log(err))
        })

        // const order = await rzp.orders.create({amount,currency:"INR"})
        // const create = await req.user.createOrder({orderid:order.id,status:'pending'})
        // return res.status(201).json({order,key_id:rzp.key_id})


    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong' })
    }
}

exports.updatetranstatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const name = req.user.name;
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderId: order_id } })
        const promise1 = order.update({ paymentId: payment_id, status: 'SUCCESSFUL' })
        const promise2 = req.user.update({ ispremiumuser: true })
        Promise.all([promise1, promise2])
            .then(() => {
                return res.status(202).json({ success: true, message: "Transection Successful", token: userController.generateToken(userId, name, true)})
            }).catch(err => console.log(err))
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong' })
    }
}