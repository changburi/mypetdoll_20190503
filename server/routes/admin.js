const express = require('express')
let router = express.Router()

//router.get('/', (req, res, next)=>{
//    res.send('/admin');
//})

const {clothes, users, purchase} = require('../models')
const file = require('../utils/fileUpload')

router.get('/clothes', (req, res) => {
    let page = req.query.page || 0
    let limit = 20

    clothes.findAndCountAll({
        raw: true,
        limit: limit,
        offset: page * limit
    }).then((result) => {
        res.json({
            totalCount: result.count,
            cloth: result.rows,
            limit: limit,
            currentPage: page
        })
    })
})

router.get('/users', (req,res)=>{
    let page = req.query.page || 0
    let limit = 20
    
    users.findAndCountAll({
        raw:true,
        limit:limit,
        offset:page * limit
    }).then((result)=>{
        res.json({
            totalCount:result.count,
            user:result.rows,
            limit:limit,
            currentPage:page
        })
    })
})

router.get('/purchase', (req,res)=>{
    let page = req.query.page || 0
    let limit = 20
    
    purchase.findAndCountAll({
        raw:true,
        order: [
            ['id', 'DESC']
        ],        
        limit:limit,
        offset:page * limit,
        include: [
            {model:users},
            {model:clothes},
        ]
    }).then((result)=>{
        res.json({
            totalCount:result.count,
            purchase:result.rows,
            limit:limit,
            currentPage:page
        })
    })
})

router.post('/clothes/registry', file.single('img'), (req,res,next) => {
    let {clothId, name, price, category, register,description} = req.body
    console.log('register the clothes registry')
    console.log(register)
    if (register==1) {
        console.log('register the clothes')
        clothes.create({
            name: name, price: price,
            category: category, img: req.file.filename,
            description: description
        }).then(result => {
            res.status(201).json({message: 'succeess'})
        })        
    } else {
        console.log('unregister the clothes')
        console.log(clothId)
        clothes.destroy({
            where: {id: clothId}
        }).then(result => {
            res.status(201).json({message: 'succeess'})
        })
    }
})

module.exports = router;