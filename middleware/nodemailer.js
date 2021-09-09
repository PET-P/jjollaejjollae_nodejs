const nodemailer = require('nodemailer')

module.exports = {
  sendCode: async (code, email) => {
    try {
      let transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "929eb51470f216",//dotenv 처리필요
          pass: "e794866d610ef8" //dotenv 처리필요
        }
      })

      let info = await transport.sendMail({
        from: "ghwar100@gmail.com",
        to: "f0c837ec7a-882864@inbox.mailtrap.io", // email
        subject: "Hello ✔", // Subject line
        html: code, // plain text body
      })

      return info
    } catch (e) {
      return e
    }
  }
}