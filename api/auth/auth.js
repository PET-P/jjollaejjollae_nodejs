const User = require('../../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { sign, verify, refresh, refreshVerify } = require('../../middleware/jwt');
const crypto = require('crypto');
const { sendCode } = require('../../middleware/nodemailer');

const generatePassword = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const specials = '!@#$%^&*';
  const stringLength = 8;

  var randomString = "";
  for (let i = 0; i < stringLength; i++) {
    if (i < 6) {
      let randomNum = Math.floor(Math.random() * chars.length);
      randomString += chars.substring(randomNum, randomNum + 1);
    }
    else {
      let randomNum = Math.floor(Math.random() * specials.length);
      randomString += specials.substring(randomNum, randomNum + 1);
    }
  }
  return randomString;
}

module.exports = {
  authLogin: async (req, res) => {
    try {
      passport.authenticate('local', { session: false }, (passportError, user, info) => {
        if (passportError) {
          return res.status(500).json({
            success: false,
            error: passportError
          });
        } else if (!user) { //나중에 필요 없을듯
          return res.status(400).json({
            success: false,
            message: info.reason
          });
        } else {
          const accessToken = sign(user);
          const refreshToken = refresh(user._id);

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
      })(req, res);
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  authEmail: async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email: email }).select('_id').lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '존재하지 않는 사용자입니다.'
        })
      } else {
        return res.status(200).json({
          success: true,
          message: '존재하는 사용자입니다.'
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  authToken: async (req, res) => {
    try {
      // access token과 refresh token의 존재 유무를 체크합니다.
      if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        // access token 검증 -> expired여야 함.
        const authResult = verify(authToken);

        // access token 디코딩하여 user의 정보를 가져옵니다.f
        const decoded = jwt.decode(authToken);

        // 디코딩 결과가 없으면 권한이 없음을 응답.
        if (decoded === null) {
          return res.status(400).send({
            success: false,
            message: '잘못된 접근입니다.',
          });
        }

        /* access token의 decoding 된 값에서
          유저의 id를 가져와 refresh token을 검증합니다. */
        const refreshResult = refreshVerify(refreshToken, decoded.email);
        // 재발급을 위해서는 access token이 만료되어 있어야합니다.
        if ((authResult === null || authResult.ok === false) && authResult.message === 'jwt expired') {
          // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
          if (refreshResult.ok === false) {
            res.status(401).send({
              success: false,
              message: 'RefreshToken Expired',
            });
          } else {
            // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
            const newAccessToken = sign({ _id: decoded.userId, admin: decoded.admin });

            if (jwt.decode(refreshToken).exp - parseInt(Date.now() / 1000) < 7 * 24 * 3600) { //refreshToken 유효시간 7일이내
              newRefreshToken = refresh(decoded.userId)
              res.status(200).send({ // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
                success: true,
                message: 'access/refresh 토큰 발급',
                data: {
                  userId: decoded.userId,
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                },
              });
            } else {
              res.status(200).send({ // 새로 발급한 access token을 반환합니다.
                success: true,
                message: 'access 토큰 발급',
                data: {
                  userId: decoded.userId,
                  accessToken: newAccessToken,
                },
              });
            }
          }
        } else {
          // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
          res.status(400).send({
            success: false,
            message: 'Access token is not expired!',
            data: {
              userId: decoded.userId
            }
          });
        }
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        error: e.message
      });
    }
  },
  findPassword: async (req, res) => {
    try {

      const email = req.query.email;
      const user = await User.findOne({ email: email }).select('_id').lean();

      if (!user) {
        res.status(404).json({
          success: false,
          message: '존재하지 않는 사용자입니다.'
        })
      }
      else {
        let tempPassword = generatePassword();
        let result = await sendCode(tempPassword, email)

        if (result) {
          await User.findOneAndUpdate({ _id: user._id }, { tempPassword: tempPassword })
          res.status(200).json({
            success: true,
            message: '비밀번호가 메일로 발송되었습니다.'
          })
        }
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        error: e
      });
    }
  }
  // checkCode: async (req, res) => {
  //   try {
  //     let email = req.query.email
  //     let code = req.query.code

  //     const user = await User.findOne({ email: email },).select('+code').lean()
  //     if (user) {
  //       if (user.code === code) {
  //         let keyOne = crypto.randomBytes(256).toString('hex').substr(100, 5);
  //         let keyTwo = crypto.randomBytes(256).toString('base64').substr(50, 5);
  //         let tempPassword = keyOne + keyTwo;
  //         await User.findByIdAndUpdate(user._id, { password: tempPassword }, {
  //           new: true,
  //           runValidators: true,
  //         });
  //         res.status(200).json({
  //           success: true,
  //           message: '임시비밀번호가 발급되었습니다.',
  //           data: { tempPassword: tempPassword }
  //         })
  //       }
  //       else {
  //         res.status(400).json({
  //           success: false,
  //           massage: '발급코드가 틀렸습니다.'
  //         })
  //       }
  //     } else {
  //       res.status(500).json({
  //         success: false,
  //         message: '유저가 없습니다?'
  //       });
  //     }
  //   } catch (e) {
  //     console.log(e)
  //     res.status(500).json({
  //       success: false,
  //       error: e
  //     });
  //   }
  // }
}

