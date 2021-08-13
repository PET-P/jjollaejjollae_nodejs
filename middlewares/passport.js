const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
// const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const passportConfig = { usernameField: 'email', passwordField: 'password' };
// const JWTConfig = {
//   jwtFromRequest: ExtractJwt.fromHeader('authorization'),
//   secret: process.env.SECRET
// }

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

// const JWTVerify = async (jwtPayload, done) => {
//   try {
//     const user = await User.findOne({ email: jwtPayload.email });

//     if (user) {
//       done(null, user);
//       return
//     }
//     done(null, false, { reason: '올바르지 않은 인증정보 입니다.' })

//   } catch (e) {
//     console.error(e);
//     done(e);
//   }
// };

module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
  // passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};