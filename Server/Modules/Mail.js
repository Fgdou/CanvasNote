let nodemailer = require("nodemailer")
let config = require("../config.json")

let handle = nodemailer.createTransport(config.mail)

module.exports = async function(to, subject, content){
        let mailOptions = {
            from: config.mail.auth.user,
            to: to,
            subject: subject,
            html: content
        }
        return new Promise((resolve, reject) => {
            if(!to)
                reject("No destination")
            else if(!subject)
                reject("No subject")
            else{
                handle.sendMail(mailOptions, (err)=>{
                    if(err)
                        reject(err)
                    else
                        resolve()
                })
            }
        })
    }