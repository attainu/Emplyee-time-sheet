const nodemailer = require("nodemailer")




module.exports = async (emailsArr, title, body) => {
    
    console.log(emailsArr, title, body, 'emailsArr, title, body')

    let appEmail = await process.env.appEmail
    let appEmailPassword = await process.env.appEmailPassword

    let emailsStr = ""
    emailsArr.forEach(email => {
        return emailsStr = emailsStr + `${email}, `
    })

    console.log(emailsStr, typeof(emailsStr), "emails")

    let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,

        auth: {
        user: appEmail,
        pass: appEmailPassword
        }

    });

    let mailOptions = await {
        from: appEmail,
        to: emailsStr,
        subject: title,
        html: body
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          console.log(appEmail, typeof(appEmail))
          console.log(appEmailPassword, typeof(appEmailPassword))
          console.log(transporter.options.auth)

        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}