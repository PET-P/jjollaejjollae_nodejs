const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const { StringDecoder } = require('string_decoder');
const { SECRET, OPTION_ALGO, OPTION_ACCESS_EXPI, OPTION_REFRESH_EXPI } = process.env;

module.exports = {
  sign: (user) => { // access token 발급
    const payload = { // access token에 들어갈 payload
      userId: user._id,
      admin: user.admin,
    };

    return jwt.sign(payload, SECRET, { // SECRET으로 sign하여 발급하고 return
      algorithm: OPTION_ALGO, // 암호화 알고리즘
      expiresIn: OPTION_ACCESS_EXPI, 	  // 유효기간
    });
  },
  verify: (token) => { // access token 검증
    let decoded = null;
    try {
      decoded = jwt.verify(token, SECRET);
      return {
        ok: true,
        userId: decoded.userId,
        admin: decoded.admin,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  refresh: (userId) => { // refresh token 발급
    refreshToken = jwt.sign({}, SECRET, { // refresh token은 payload 없이 발급
      algorithm: OPTION_ALGO,
      expiresIn: OPTION_REFRESH_EXPI,
    });
    redisClient.set(String(userId), refreshToken);
    return refreshToken
  },
  refreshVerify: async (token, userId) => { // refresh token 검증
    /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
    const getAsync = promisify(redisClient.get).bind(redisClient);

    try {
      const data = await getAsync(String(userId)); // refresh token 가져오기
      if (token === data) {
        try {
          jwt.verify(token, SECRET);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};