const User = require('../../models/user');
const Wishlist = require('../../models/wishlist');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sign, verify, refresh, refreshVerify } = require('../../middleware/jwt');


module.exports = {
  socialAuth: async (req, res) => {
    try {
      const { email, accountType } = req.body;
      let user = await User.findOne({ email: email, accountType: accountType }).select('_id email accountType').lean()
      // console.log(user)

      if (!user) {
        let keyOne = crypto.randomBytes(256).toString('hex').substr(100, 10);
        let keyTwo = crypto.randomBytes(256).toString('base64').substr(50, 10);
        req.body.password = keyOne + keyTwo;

        // req.body.accountType = 'social';
        user = new User(req.body)

        await user.save(async (err, doc) => {
          if (err) {
            console.log(err)
            return res.status(500).json({
              success: false,
              error: err
            });
          }
          else {
            const wish = new Wishlist({ userId: doc._id });
            await wish.save();

            const accessToken = sign(doc);
            const refreshToken = refresh(doc.email);

            return res.status(200).json({
              success: true,
              message: "회원가입 성공",
              data: {
                _id: doc._id,
                accessToken: accessToken,
                refreshToken: refreshToken
              }
            });
          }
        });
      } else if (['naver', 'kakao', 'apple'].includes(user.accountType)) {
        const accessToken = sign(user);
        const refreshToken = refresh(user.email);

        res.status(200).json({
          success: true,
          message: '로그인 성공',
          data: {
            _id: user._id,
            accessToken: accessToken,
            refreshToken: refreshToken
          }
        });
      }
      else {
        res.status(400).json({
          success: false,
          message: '소셜로그인 계정이 아닙니다.'
        })
      }
    } catch (e) {
      console.log(e)
      res.status(500)
    }
  }
  // socialAuth: async (req, res) => {
  //   try {
  //     const email = req.user.email;
  //     let user = await User.findOne({ email: email })
  //     if (!user) {
  //       let keyOne = crypto.randomBytes(256).toString('hex').substr(100, 10);
  //       let keyTwo = crypto.randomBytes(256).toString('base64').substr(50, 10);
  //       req.user.password = keyOne + keyTwo;

  //       req.user.accountType = 'social';
  //       user = new User(req.user)

  //       await user.save(async (err, doc) => {
  //         if (err) {
  //           console.log(err)
  //           return res.status(500).json({
  //             success: false,
  //             error: err
  //           });
  //         }
  //         else {
  //           const wish = new Wishlist({ userId: user._id });
  //           await wish.save();

  //           const accessToken = sign(user);
  //           const refreshToken = refresh(user.email);

  //           return res.status(200).json({
  //             success: true,
  //             message: "회원가입 성공",
  //             data: {
  //               _id: user._id,
  //               accessToken: accessToken,
  //               refreshToken: refreshToken
  //             }
  //           });
  //         }
  //       });
  //     } else if (user.accountType === 'social') {
  //       const accessToken = sign(user);
  //       const refreshToken = refresh(user.email);

  //       user.accessToken = accessToken;
  //       user.refreshToken = refreshToken;

  //       res.status(200).json({
  //         success: true,
  //         message: '로그인 성공',
  //         data: user
  //       });
  //     }
  //     else {
  //       res.status(400).json({
  //         success: false,
  //         message: '소셜로그인 계정이 아닙니다.'
  //       })
  //     }
  //   } catch (e) {
  //     console.log(e)
  //     res.status(500)
  //   }
  // }
}