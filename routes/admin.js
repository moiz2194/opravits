const express = require('express');
const router = express.Router();
const asyncerror = require('../middlewares/catchasyncerror.js');
const ErrorHandler = require('../middlewares/errorhandler');
const Employee=require('../model/employee.js')
const Membership=require('../model/membership.js')
const User=require('../model/user.js')
const Member=require('../model/members.js')
const Category=require('../model/category.js')
const cloudinary=require('cloudinary')
const {verifyToken,isadmin}=require('../middlewares/verifyauth.js')
const jwt=require('jsonwebtoken')
router.post('/login', asyncerror(async (req, res, next) => {
    const user = await Employee.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler('No user found', 404))
    }
    if (user.role==='user'||user.role==='business') {
        return next(new ErrorHandler('Not allowed', 405))
    }
    if (user.password !== req.body.password) {
        console.log(user.mapiframe)
        return next(new ErrorHandler('Wrong credentials', 405))
    }
    const token = jwt.sign({ id: user._id }, 'moiz2194')
    res.status(200).send({ success: true, token })
}))
router.post('/addemployee',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const user = await Employee.create(req.body)
   
    res.status(200).send({ success: true, user })
}))
router.post('/delemployee',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const user = await Employee.findByIdAndDelete(req.body.id)
   
    res.status(200).send({ success: true, user })
}))
router.get('/allcategory',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const category = await Category.find()
   
    res.status(200).send({ success: true, category })
}))
router.get('/allbusiness',verifyToken, asyncerror(async (req, res, next) => {
    const business = await User.find({role:"business"})
   
    res.status(200).send({ success: true, business })
}))
router.get('/dashboard',verifyToken,asyncerror(async(req,res,next)=>{
    const business = await User.find({role:"business"})
    const users = await User.find({role:"user"})
    const members = await Member.find().populate('membership_id')
    let totalbusiness=0
    let totalusers=0
    let totalrevenue=0
    business.forEach(()=>{
        totalbusiness+=1
    })
    users.forEach(()=>{
        totalusers+=1
    })
    members.forEach((elem)=>{
        totalrevenue+=elem.membership_id.price
    })
    res.status(200).send({success:true,totalbusiness,totalusers,totalrevenue})
}))
router.post('/updatebusiness',verifyToken, asyncerror(async (req, res, next) => {
    const business = await User.findByIdAndUpdate(req.body.id,req.body)
    
    res.status(200).send({ success: true, business })
}))
router.post('/updateemployee',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const business = await Employee.findByIdAndUpdate(req.body.id,req.body)
    
    res.status(200).send({ success: true, business })
}))
router.post('/delbusiness',verifyToken, asyncerror(async (req, res, next) => {
    const business = await User.findByIdAndDelete(req.body.id)
    
    res.status(200).send({ success: true, business })
}))
router.get('/allusers',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    let users = await User.find({ role: "user" }).populate({
        path: 'membership_id',
        populate: {
          path: 'membership_id',
          model: 'membership'
        }
      });
      
    res.status(200).send({ success: true, users })
}))
router.get('/allemployee',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const users = await Employee.find()
    res.status(200).send({ success: true, users })
}))
router.get('/allplans', asyncerror(async (req, res, next) => {
    const plan = await Membership.find()
    
    res.status(200).send({ success: true, plan })
}))
router.post('/addplan',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const plan = await Membership.create(req.body)
    
    res.status(200).send({ success: true, plan })
}))
router.post('/delplan',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const plan = await Membership.findByIdAndDelete(req.body.id)
    
    res.status(200).send({ success: true, plan })
}))
//category

router.post('/addcategory',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    const result=await cloudinary.v2.uploader.upload(req.body.image)
    req.body.url=result.url
    req.body.public_id=result.public_id
    const user = await Category.create(req.body)
   
    res.status(200).send({ success: true, user })
}))
router.post('/delcategory',verifyToken,isadmin, asyncerror(async (req, res, next) => {
    await cloudinary.v2.uploader.destroy(req.body.public_id)
    const user = await Category.findByIdAndDelete(req.body.id)
   
    res.status(200).send({ success: true, user })
}))


module.exports=router
