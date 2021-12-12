import express from "express"
import asyncHandler from 'express-async-handler'
import Category from "../models/categoryModel.js"
import Product from '../models/productModel.js'
import mongoose from "mongoose"
import multer from 'multer'
const router =express.Router()

const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype]
      let uploadError = new Error('Invalid File Type')
      if(isValid) {
          uploadError = null
      }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
      const filename = file.originalname.split(' ').join('-')
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${filename}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })

router.get('/', asyncHandler(async(req, res)=>{
    let filter ={};
    if(req.query.categories) {
        filter = { category: req.query.categories.split(',')}
    }
    const products = await Product.find(filter).populate('category')

    res.json(products)
}))

router.get('/:id', asyncHandler(async(req, res)=>{
    const product = await Product.findById(req.params.id).populate('category')
    if(product) {
        res.send(product)
    } else {
        res.status(404)
        throw new Error('Product not Found')
    } 
}))

router.put('/:id', asyncHandler(async (req, res) =>{

    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid product Id')
    }

    const category =await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(req.params.id,{
        user:req.body.user,
        name:req.body.name,
        image:req.body.image,
        brand:req.body.brand,
        category:req.body.category,
        description:req.body.description,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        price:req.body.price,
        countInStock:req.body.countInStock,
        isFeatured:req.body.isFeatured,
    },
    { new:true })

    if(!product) {
        return res.status(404).send('category is not updated')
    }

    res.send(product)
}))

router.delete('/:id', asyncHandler((req, res) =>{
    Product.findByIdAndRemove(req.params.id).then((product)=>{
        if(product) {
        res.status(200).json({success: true, message:'product deleted successfully'})
    } else {
        res.status(404).json({success: false, message:'product is not deleted'})
    }
    }).catch(err =>{
        res.status(400).json({success: false, error:err})
    })
    //res.send(category);
}))



router.post('/', uploadOptions.single('image'), asyncHandler(async(req, res)=>{
    const category =await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    const file = req.file
    if(!file) return res.status(400).send('Please Select a image')

    const filename = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    let product = new Product({
        user:req.body.user,
        name:req.body.name,
        image:`${basePath}${filename}`,
        brand:req.body.brand,
        category:req.body.category,
        description:req.body.description,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        price:req.body.price,
        countInStock:req.body.countInStock,
        isFeatured:req.body.isFeatured,
    })
    product = await product.save()

    if(!product) {
        return res.status(500).send('product is not created')
    }

    res.send(product)
    
}))

router.put('/galleryImages/:id', uploadOptions.array('images'), asyncHandler(async (req, res) =>{
   
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid product Id')
    }

    const files = req.files

    let imagePath = []
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    if(files) {
        files.map(file => {
            imagePath.push(`${basePath}${file.filename}`)
        })
    }

    const productImages = await Product.findByIdAndUpdate(req.params.id,{
        images:imagePath
    },
    { new:true })

    if(!productImages) {
        return res.status(404).send('category is not updated')
    }

    res.send(productImages)
}))


export default router;