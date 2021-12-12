import express from "express"
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const router =express.Router()

router.get(`/`, asyncHandler(async (req, res) =>{
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
}))

router.get('/:id', asyncHandler(async (req, res) =>{
    const user = await User.findById(req.params.id).select('-password')

    if(!user) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(user);
}))


router.post('/register', asyncHandler(async (req, res) =>{
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password,10)
    })
    user = await user.save()

    if(!user) {
        return res.status(404).send('category is not created')
    }

    res.send(user)
}))

router.post('/login', asyncHandler(async (req, res) =>{
    const user = await User.findOne({email: req.body.email})

    let secret = process.env.secret

    if(!user) {
        return res.status(400).send('User not Found')
    }
    if(user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({ user:user.id, isAdmin:user.isAdmin },secret)
        res.status(200).send({user:user.email, token})
    } else{
        res.status(404).send('Password is Wrong')
    }
    //return res.status(200).send(user)

}))

router.delete('/:id', asyncHandler( (req, res) =>{
    User.findByIdAndRemove(req.params.id).then((user)=>{
        if(user) {
        res.status(200).json({success: true, message:'user deleted successfully'})
    } else {
        res.status(404).json({success: false, message:'user is not deleted'})
    }
    }).catch(err =>{
        res.status(400).json({success: false, error:err})
    })
    //res.send(category);
}))


router.get(`/get/count`, asyncHandler(async (req, res) =>{
    const userCount = await User.countDocuments(count => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send(userCount);
}))


export default router