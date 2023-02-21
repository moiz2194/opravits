const express = require('express');
const router = express.Router();
const asyncerror = require('../middlewares/catchasyncerror.js');
const ErrorHandler = require('../middlewares/errorhandler');
const User = require('../model/user.js')
const Category = require('../model/category.js')
const sendmsg = require('../middlewares/sendmsg.js')
const { verifyToken, isadmin } = require('../middlewares/verifyauth.js')
const Apifeature = require('../utilis/apifeature.js');
const otpGenerator = require('otp-generator')
const cloudinary = require('cloudinary')
const Member = require('../model/members')
const Membership = require('../model/membership')
const jwt = require('jsonwebtoken')
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
    const result = await cloudinary.v2.uploader.upload(req.body.profile);
    req.body.url = result.url
    let user = await User.create(req.body)

    const token = jwt.sign({ id: user._id }, 'moiz2194')
    res.status(200).send({ success: true, token, user })

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
    let user = await User.findOne({ mobile: req.body.mobile, role: "user" })
    if (!user) {
        return next(new ErrorHandler('No user found', 404))
    }
    const token = jwt.sign({ id: user._id }, 'moiz2194')

    res.status(200).send({ success: true, token, user })

}))
router.post('/otp', asyncerror(async (req, res, next) => {
    const otp = otpGenerator.generate(6, { specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false });
    sendmsg(req.body.mobile, otp)
    const token = jwt.sign({ otp }, 'moiz2194')
    res.status(200).send({ success: true, token })
}))


router.get('/allcategory', asyncerror(async (req, res, next) => {
    const category = await Category.find()

    res.status(200).send({ success: true, category })
}))

router.get('/allbusiness', verifyToken, asyncerror(async (req, res, next) => {
    const me = await User.findById(req._id);
    let business;
    if (me.membership_id === undefined || me.membership_id === null) {
        business = new Apifeature(User.find(), req.query).Search().filter().limit(5).bussiness()
    }
    business = new Apifeature(User.find(), req.query).Search().filter().bussiness()
    let data = await business.search

    res.status(200).send({ success: true, data })
}))
router.post('/addclick', verifyToken, asyncerror(async (req, res, next) => {
    const user = await User.findById(req.body.id)
    await User.findByIdAndUpdate(user._id, {
        clicks: user.clicks + 1
    })

    await user.incrementClicks();



    res.status(200).send({ success: true })
}))
router.post('/buymembership', verifyToken, asyncerror(async (req, res, next) => {
    const membership = await Member.create({ user_id: req._id, membership_id: req.body.id })

    await User.findByIdAndUpdate(req._id, {
        membership_id: membership._id
    })

    res.status(200).send({ success: true, membership })
}))
router.get('/getallmembership', verifyToken, asyncerror(async (req, res, next) => {
    const mymembership = await Member.find({ user_id: req._id })
    const membership = await Membership.find();
    if (mymembership !== null) {
        //create result
        membership.forEach((elem) => {
            var result;
              mymembership.forEach(element => {
                if (element.membership_id.toString() === elem._id.toString()) {
                    result= true
                } 
            });
            //
            // console.log(mymembership,elem._id)
            if (result) {
                elem.button = "Owned"
            }
        })
    }


    res.status(200).send({ success: true, membership })
}))


module.exports = router