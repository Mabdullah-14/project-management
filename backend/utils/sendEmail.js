const nodemailer=require('nodemailer')

const sendEmail=async(options)=>{
    try{
        const transporter=nodemailer.createTransport({
            service:'Gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        })
        const mailOptions={
            from: `"COLLABRATION BOARD <${process.env.EMAIL_USER}>"`,
            to:options.email,
            subject:options.subject,
            title:options.title,
            text:options.message,
        }
        const info=await transporter.sendMail(mailOptions)
         console.log(`Email successfully sent: ${info.messageId}`);
        return info

    }catch(error){
        console.log(error)
        console.error("Nodemailer Email Error:", error.message);
        throw new Error("Email engine failed to send message.");
    }
}
module.exports=sendEmail;