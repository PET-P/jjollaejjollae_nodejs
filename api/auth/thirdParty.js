const User = require('../../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sign, verify, refresh, refreshVerify } = require('../../middleware/jwt');


module.exports = {
  socialAuth: async (req, res) => {
    try {
      const email = req.user.email;
      let user = await User.findOne({ email: email })
      if (!user) {
        let key_one=crypto.randomBytes(256).toString('hex').substr(100, 10);
        let key_two=crypto.randomBytes(256).toString('base64').substr(50, 10);
        req.user.password = key_one+key_two;

        user = new User(req.user)
        await user.save((err, doc) => {
          if (err) {
            console.log(err)
            return res.status(500).json({
              success: false,
              error: err
            });
          }
          else {
            const accessToken = sign(user);
            const refreshToken = refresh(user.email);

            return res.status(200).json({
              success: true,
              message: "회원가입 성공",
              data: {
                _id: user._id,
                access_token: accessToken,
                refresh_token: refreshToken
              }
            });
          }
        });
      }else{
        const accessToken = sign(user);
        const refreshToken = refresh(user.email);

        user.access_token = accessToken;
        user.refresh_token = refreshToken;

        res.status(200).json({
          success: true,
          message: '로그인 성공',
          data: user
        });
      }
    } catch (e) {
      console.log(e)
      res.status(500)
    }
  }
}