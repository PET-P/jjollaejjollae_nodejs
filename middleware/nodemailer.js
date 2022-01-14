const nodemailer = require('nodemailer')
const { GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;
module.exports = {
  sendCode: async (code, email) => {
    try {
      let transport = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        auth: {
          user: GMAIL_EMAIL,
          pass: GMAIL_PASSWORD
        }
      })

      let info = await transport.sendMail({
        from: `"ZOLLE Team" <${GMAIL_EMAIL}>`,
        to: email,
        subject: "안녕하세요 쫄래쫄래팀입니다! 새로운 비밀번호를 확인해주세요.✔", // Subject line
        html: code, // plain text body
      })

      return info
    } catch (e) {
      return e
    }
  }
}