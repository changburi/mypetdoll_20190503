const express = require('express')
const fs = require('fs')
const session = require('express-session')
const passport = require('./utils/passport')

let app = express()

const bodyParser = require('body-parser');

const {Nuxt, Builder} = require('nuxt');
const config = require('../nuxt.config.js');
const routes = require('./routes');
let nuxt = new Nuxt(config);

const http = require('http')
const server = http.createServer(app)

app.use(session({
    secret:'#123#123#asd#qwe#zxc#qwer#128*(*&asdjkwhereareyoufrom',
    resave:false,
    saveUnitialized:false,
    cookie:{maxAge:1000 * 60 * 60 * 24 * 7} // 1000 * 60 * 60 * 24 ==> 하루
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/uploads/:filename', (req, res) => {
    let file = __dirname + '/uploads/'+ req.params.filename
    console.log('ocj uploads filename')
    console.log(file)
    fs.readFile(file, (err, data) => {
        res.end(data)
    })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

app.use('/api/v1.0', routes)
app.use(nuxt.render);

let builder = new Builder(nuxt);
builder.build()

server.listen(3000, ()=> {
console.log('server on 3000 port')
})