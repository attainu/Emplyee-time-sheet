const nodemailer = require("nodemailer")




module.exports = async (email, otp) => {
     
    let appEmail = await process.env.appEmail
    let appEmailPassword = await process.env.appEmailPassword

let transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    // auth: {
    //   user: 'employees.timesheet.application@gmail.com',
    //   pass: 'applicationpassword'
    // }
    auth: {
      user: appEmail,
      pass: appEmailPassword
    }
    // auth: {
    //     user: process.env.appEmail,
    //     pass: process.env.appEmailPassword
    // }
});

    let mailOptions = await {
        from: appEmail,
        // from: process.env.appEmail,
        to: email,
        subject: "OTP for registering to Employee's Time-sheet",
        html: `
            <h3>OTP = ${otp}</h3>
            <p>OTP will expire after 10 minutes.</p>
        `
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