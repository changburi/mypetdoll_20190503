const nodemailer = require('nodemailer');
//const {email, password} = require('./EMAIL')["GMAIL"];
const jade = require('jade');

const filePath = __dirname + '/temp.jade';

module.exports = (testData) => {
    return new Promise( (resolve, reject) => {
    
        let transporter = nodemailer.createTransport({
            service:'Gmail',
            auth: {
                user:'changbur',
                pass:'hope9638!'
            },
            host: 'smtp.gmail.com',
            port: "465",
            secure: false,
            ignoreTLS: false,
        });

        let mailOptions = {
            from:'changbur@gmail.com',
            to: 'changburi@gmail.com',
            subject: '주문 정보가 도착했습니다 !!',
            text: testData
//            html:jade.renderFile(filePath, infos)
        };

        transporter.sendMail(mailOptions, (err, info) => {
                console.log(mailOptions);              
                console.log('ocj sendMail');               
            if (err) {
                console.log('sendMail Error');                       
                reject(err);
            }
            transporter.close();
            resolve()
        });
    }).catch((error) => {
        if(error.response) {
            console.log('ocj error index async log');
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);                        
        }                    
    });
}