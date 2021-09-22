const express = require("express");
const router = express.Router();
const authController = require("./auth");
const thirdPartyController = require("./thirdParty")
const passport = require('passport');

// router.post("", userController.userCreate);
// router.get("", userController.userList);
// router.get("/:id", userController.userRead);
// router.patch("/:id", userController.userUpdate);
// router.delete("/:id", userController.userDelete);
router.post('', authController.authLogin);
router.post('/email', authController.authEmail);
router.get('', authController.authToken);
router.post('/password', authController.findPassword)
router.get('/password', authController.checkCode)

router.post('/social',thirdPartyController.socialAuth);

// router.get('/naver', passport.authenticate('naver', { session: false }));
// router.get('/naver/callback',
//   passport.authenticate('naver', { session: false }), thirdPartyController.socialAuth
// );

// router.get('/kakao', passport.authenticate('kakao', { session: false }));
// router.get('/kakao/callback',
//   passport.authenticate('kakao', { session: false }), thirdPartyController.socialAuth
// );


module.exports = router;