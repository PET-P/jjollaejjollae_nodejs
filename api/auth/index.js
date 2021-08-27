const express = require("express");
const router = express.Router();
const authController = require("./auth");

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

module.exports = router;