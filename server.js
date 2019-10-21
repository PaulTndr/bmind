//Express
var express         = require('express')
var app             = express();

//Port
const port          = 3000;
let http            = require('http');

let server          = http.Server(app);

var nodemailer      = require("nodemailer");

//Test API Call
app.get('/send/mail', (req, res) => {
    console.log(req.url)

    var contact = req.param('contact');
    var body = req.param('body');
    var source = req.param('source');

    var mail_data = {
        "to": "paul.tondereau@yahoo.fr",
        "subject": "Nouveau message ["+source+"]",
        "msg": body
    }

    var transport = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: "bmindDev@gmail.com",
            pass: "bmindDev/0mail" 
        }            
    });

    var mailOptions = {
        from: "Automatic bmindDev",
        to: mail_data.to,
        subject: mail_data.subject,
        html: 
            "<body>"+
                "<div>"+
                    "<p><b>Contact</b> : <b style='color:orange;'>"+contact+"</b></p>"+
                "</div>"+
                "<div>"+
                    "<p><b>Contenu du message :</b></p>"+
                    "<p>"+mail_data.msg+"</p>"+
                "</div>"+
            "</body>"
    };   

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });  


    res.json({
        'success': true,
        'match': true
    });
});


//Listening
server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});