const express = require('express');
let router = express.Router();
var totalPrice = 0


const {users, cart, clothes} = require('../models')

router.get('/', (req, res, next)=>{
    let userId = req.user.id
    let page = req.query.page || 0
    let limit = 20

    cart.findAndCountAll({
        raw: true,
        order: [
            ['id', 'ASC']
        ],
        limit: limit,
        offset: page * limit,
        include: [
            {model: users},
            {model: clothes},
        ],
        where: {userId:userId}
    }).then((result)=>{
        res.json({
            totalCount:result.count,
            cart:result.rows,
            limit:limit,
            currentPage:page
        })
    }, err=> {
        console.log(err)
    })
})

router.post('/', (req, res, next) => {
//    console.log(req.user)
    if(!req.user){
        totalPrice = 0
        cart.destroy({
            where: {},
            truncate: true
        })
        return res.status(200).json({msg: '로그인 하지 않았습니다.'})
    }

    let userId = req.user.id
    let {isLogin, cartId, clothId, price, count, desription} = req.body

    console.log('ocj')
    console.log(isLogin)    
    console.log(clothId)
    console.log(price)
    console.log(count)
    console.log(req.body)
    
//    let leftPrice = 0
    let currentPrice = 0    
//    let totalPrice = 0
    console.log('isLogin')
    console.log(this.isLogin)
    
    if (isLogin == 1) {
        console.log('isLogin destroy')
        totalPrice = 0
        return cart.destroy({
                where: {},
                truncate: true
        })
    }
    
    users.findById(userId, {
        raw: true
    }).then((result) => {
        //if(result['price'] >= price * count){  // 유저가 가지고 있는 돈 검사
        //    leftPrice = result['price'] - price * count // 제품 가격만큼 차감
        currentPrice = price * count
        console.log('cart price and count')
        console.log(totalPrice)       
        console.log(price)
        console.log(result['price'])
//        totalPrice = result['price'] + price * count
        
        if (price > 0) {
            if (currentPrice >= 0) { // 유저가 가지고 있는 돈 검사
                return cart.create({
                    userId: userId,
                    clotheId: clothId,
                    count: count
                })
            } else {
                res.status(204).json({})
            }
        } else {
            console.log('destroy the cart')
            return cart.destroy({
                where: {id: cartId}
            })
        }
    }).then((result) => {
//        return users.update(  // 제품 가격만큼 차감
//            {price : totalPrice},
//            {where: {id: userId}}
//        )

        
        totalPrice = totalPrice + currentPrice
        console.log(currentPrice)
        console.log(totalPrice)
        return cart.update(  // 제품 가격만큼 차감
            {price : totalPrice},
            {where: {id: result['id']}}
        )        
    }).spread((affectedCount, affectedRows) => {
        res.status(201).json({})
    })
})

module.exports = router;