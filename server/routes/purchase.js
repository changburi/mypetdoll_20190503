const express = require('express');
let router = express.Router();


const {users, purchase, clothes} = require('../models')
const mailer = require('../utils/message')

function sendEmailMessage(testData) {
    mailer(testData).then(()=>{
        console.log('sendEmailMessage success');
        console.log(testData);        
    }), err=>{
        console.log(err);
    }
}

router.get('/', (req, res, next)=>{
    let userId = req.user.id
    let page = req.query.page || 0
    let limit = 20

    purchase.findAndCountAll({
        raw: true,
        order: [
            ['id', 'DESC']
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
            purchase:result.rows,
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
        return res.status(200).json({msg: '로그인 하지 않았습니다.'})
    }

    let userId = req.user.id
    let {purchaseId, clothId, price, count, accuPrice, orderString} = req.body

    console.log('ocj')
    console.log(orderString)    
    console.log(accuPrice)
    console.log(clothId)
    console.log(price)
    console.log(count)
    console.log(accuPrice)    
    console.log(req.body)
    
    let currentPrice = 0
    let totalPrice = 0

    users.findById(userId, {
        raw: true
    }).then((result) => {
        //if(result['price'] >= price * count){  // 유저가 가지고 있는 돈 검사
        //    leftPrice = result['price'] - price * count // 제품 가격만큼 차감
        currentPrice = price * count
        console.log('purchase price and count')
        console.log(purchaseId)        
        console.log(price)
        console.log(result['price'])
        totalPrice = result['price'] + currentPrice
        
//        let testData = '이메일 테스트 중입니당'
        
        if (price > 0) {
            if (totalPrice >= 0) { // 유저가 가지고 있는 돈 검사  
                if (orderString != null) {
                    sendEmailMessage(orderString)   
                }
                return purchase.create({
                    userId: userId,
                    clotheId: clothId,
                    count: count
                })
            } else {
                res.status(204).json({})
            }
        } else {
            console.log('destroy the purchase')
            return purchase.destroy({
                where: {id: purchaseId}
            })
        }
    }).then((result) => {
        
//        accuPrice = accuPrice + currentPrice
        console.log(currentPrice)
        console.log(accuPrice)
        purchase.update(  // 제품 가격만큼 차감
            {price : accuPrice},
            {where: {id: result['id']}}
        )
        
        return users.update(  // 제품 가격만큼 차감
            {price : totalPrice},
            {where: {id: userId}}
        )
    }).spread((affectedCount, affectedRows) => {
        res.status(201).json({})
    })
})

module.exports = router;