const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: NaverStrategy } = require('passport-naver');
const { Strategy: KakaoStrategy } = require('passport-kakao');

// const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const bcrypt = require('bcrypt');
const User = require('../models/user');

require('dotenv').config();
const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_CALLBACK_URL } = process.env;
const { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_CALLBACK_URL } = process.env;

const passportConfig = { usernameField: 'email', passwordField: 'password' };
const naverConfig = {
  clientID: NAVER_CLIENT_ID,
  clientSecret: NAVER_CLIENT_SECRET,
  callbackURL: NAVER_CALLBACK_URL
}
const kakaoConfig = {
  clientID: KAKAO_CLIENT_ID,
  clientSecret: KAKAO_CLIENT_SECRET,
  callbackURL: KAKAO_CALLBACK_URL
}

const passportVerify = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email },).select('+password').lean();

    if (!user) {
      done(null, false, { reason: '존재하지 않는 사용자 입니다.' });
      return
    }
    const compareResult = await bcrypt.compareSync(password, user.password);

    if (compareResult) {
      delete user.password
      done(null, user);
      return;
    }

    done(null, false, { reason: '비밀번호가 틀렸습니다.' });
  } catch (e) {
    console.error(e);
    done(e)
  }
};

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
  passport.use('naver', new NaverStrategy(naverConfig,
    function (accessToken, refreshToken, profile, done) {
      // console.log(accessToken)
      // console.log(refreshToken)
      // console.log(profile)
      let user = {
        nick: profile.displayName,
        email: profile.emails[0].value,
        // phone: profile.mobile
      }
      return done(null, user)
    }
  ));
  passport.use('kakao', new KakaoStrategy(kakaoConfig,
    function (accessToken, refreshToken, profile, done) {
      // console.log(accessToken)
      // console.log(refreshToken)

      let user = {
        nick: profile.displayName,
        email: profile._json.kakao_account.email,
        // phone: profile.mobile
      }
      return done(null, user)
    }
  ));
  // passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};