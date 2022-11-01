const nodeMailer = require('nodemailer');

const sendEmail = async(options)=>{

    const trasporter = await nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        service:process.env.SMTP_SERVICE,
        port:process.env.SMTP_PSSORT,
        secure:true,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASS,
        }
    });

    // console.log(trasporter);

    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    console.log(mailOptions);
    await trasporter.sendMail(mailOptions);

    // if (mail){
    //     res.status(200).json({
    //         success: true,
    //         message: `Email sent to ${user.email} successfully.`
    //     })
    // }

    // console.log(deep);
};

module.exports = sendEmail;