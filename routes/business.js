const express = require('express');
const router = express.Router();
const asyncerror = require('../middlewares/catchasyncerror.js');
const ErrorHandler = require('../middlewares/errorhandler');
const User=require('../model/user.js')
const sendmsg=require('../middlewares/sendmsg.js');
const { verifyToken } = require('../middlewares/verifyauth.js');
const jwt=require('jsonwebtoken')
const cloudinary=require('cloudinary')
router.post('/register', asyncerror(async (req, res, next) => {
    const otptoken = req.header('otp-token')
    let otp;
    if (!otptoken) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(otptoken, 'moiz2194', (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: err });
        }
        otp = decoded.otp;
    });
    console.log(otp, req.body.otp)
    if (req.body.otp !== otp) {
        return next(new ErrorHandler("Wrong otp", 405))
    }
    const result=await cloudinary.v2.uploader.upload(req.body.profile);
    req.body.url=result.url
    req.body.role="business"
    let user = await User.create(req.body)

    const token = jwt.sign({ id: user._id }, 'moiz2194')
    res.status(200).send({ success: true, token,user })

}))
router.post('/login', asyncerror(async (req, res, next) => {
    const otptoken = req.header('otp-token')
    let otp;
    if (!otptoken) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(otptoken, 'moiz2194', (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: err });
        }
        otp = decoded.otp;
    });
    console.log(otp, req.body.otp)
    if (req.body.otp !== otp) {
        return next(new ErrorHandler("Wrong otp", 405))
    }
    let user = await User.findOne({ mobile: req.body.mobile,role:"business" })
    if (!user) {
        return next(new ErrorHandler('No user found', 404))
    }
    const token = jwt.sign({ id: user._id }, 'moiz2194')

    res.status(200).send({ success: true, token ,user})

}))
//
router.get('/me',verifyToken,asyncerror(async(req,res,next)=>{
const me=await User.findById(req._id)
res.status(200).send({success:true,me})
}))
router.post('/updateme',verifyToken, asyncerror(async (req, res, next) => {
    if(req.body.profile!==null&&req.body.profile!==undefined){
        const result=await cloudinary.v2.uploader.upload(req.body.profile)
        req.body.url=result.url
        req.body.public_id=result.public_id
    }
    await User.findByIdAndUpdate(req._id,req.body)
  
      
      
   
    res.status(200).send({ success: true })
}))
module.exports=router