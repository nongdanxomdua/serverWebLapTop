const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// const User = require('../models/user');
const Staff = require('../models/staff.js');
// const User = mongoose.model('Users')

class StaffController {

    //Get all user
    async getAll(req, res, next) {
        // const item= await User.find({})
        await Staff.find({})
            .then(user => {
                try {
                   
                    return res.json({ success: true, message: 'nice (>.<)', user })
                } catch (error) {
                    res.json({ success: false, message: error }).status(404)
                }

            })
    }

    //Login
    //api/auth/login
    async login(req, res, next) {
        const {phone, password} = req.body
        if (!phone || !password)
            return res.json({ success: false, message: 'missing phone number or password' }).status(400)
        try {
            const user = await Staff.findOne({phone})
            //if have not phone number in db
            if(!user)
            return res.json({ success: false, message: 'incorrect phone number or password'}).status(400)
            const passwordValid = await argon2.verify(user.password, password)
            //check password
            if(!passwordValid) 
            return res.json({ success: false, message: 'incorrect phone number or password'}).status(400)
            // if password invalid sign token
            const accessToken = await jwt.sign({
                phone,
            }, process.env.ACCESS_TOKEN_SECRET
            )
            return res.json({success:true, message:'login successfully (>.<)', accessToken,})
        } catch (error) {
            res.json({success:false, message:error.message})
        }
    }

    //Register
    //api/auth/register
    async register(req, res, next) {
        const { phone, password,role} = req.body
        if (!phone || !password)
            return res.json({ success: false, message: 'missing phone number or password' }).status(400)
        try {
            const user = await Staff.findOne({ phone })
            //if have phonenumber in db
            if (user)
                return res.json({ success: false, message: 'phone is already' }).status(400)

            //phone is not used
            req.body.role = role ? role : 'NONE'
            //hasd password
            req.body.password = await argon2.hash(password)
            const newUser = Staff(req.body)
            await newUser.save()

            //sign token.
            const accessToken = await jwt.sign({
                phone: newUser.phone,
            }, process.env.ACCESS_TOKEN_SECRET
            )

            //return accessToken
            return res.json({ success: true, message:'register successfully (>.<)', accessToken})
        } catch (error) {
            res.json({success:false, message:error.message})
        }
    }

}

module.exports = new StaffController