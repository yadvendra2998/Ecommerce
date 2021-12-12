import express from "express"
import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'
const router =express.Router()

router.get('/', asyncHandler(async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.send(categoryList);
}))
router.get('/:id', asyncHandler(async (req, res) =>{
    const category = await Category.findById(req.params.id)

    if(!category) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(category);
}))

router.put('/:id', asyncHandler(async (req, res) =>{
    const category = await Category.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    },
    { new:true })

    if(!category) {
        return res.status(404).send('category is not updated')
    }

    res.send(category)
}))

router.post('/', asyncHandler(async (req, res) =>{
    let category = new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
    category = await category.save()

    if(!category) {
        return res.status(404).send('category is not created')
    }

    res.send(category)
}))


router.delete('/:id', asyncHandler( (req, res) =>{
    Category.findByIdAndRemove(req.params.id).then((category)=>{
        if(category) {
        res.status(200).json({success: true, message:'category deleted successfully'})
    } else {
        res.status(404).json({success: false, message:'category is not deleted'})
    }
    }).catch(err =>{
        res.status(400).json({success: false, error:err})
    })
    //res.send(category);
}))


export default router