import express from "express"
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
const router =express.Router()

router.get(`/`, asyncHandler(async (req, res) =>{
    const orderList = await Order.find();

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
}))

router.get('/:id', asyncHandler(async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({
        path:'orderItem', populate:{ path: 'product', populate:'category'}
    })

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
}))

router.put('/:id', asyncHandler(async (req, res) =>{
    const order = await Order.findByIdAndUpdate(req.params.id,{
        isPaid:req.body.isPaid,
        isDelivered:req.body.isDelivered
    },
    { new:true })

    if(!order) {
        return res.status(404).send('order is not updated')
    }

    res.send(order)
}))


router.post('/', asyncHandler(async (req, res) =>{
    let order = new Order({
        user:req.body.user,
        orderItems:req.body.orderItems,
        shippingAddress:req.body.shippingAddress,
        phoneNo:req.body.phoneNo,
        paymentMethod:req.body.paymentMethod,
        paymentResult:req.body.paymentResult,
        taxPrice:req.body.taxPrice,
        shippingPrice:req.body.shippingPrice,
        totalPrice:req.body.totalPrice,
        isPaid:req.body.isPaid,
        paidAt:req.body.paidAt,
        isDelivered:req.body.isDelivered,
        deliveredAt:req.body.deliveredAt,
    })
    order = await order.save()

    if(!order) {
        return res.status(404).send('order is not created')
    }

    res.send(order)
}))


export default router