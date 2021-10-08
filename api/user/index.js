const express = require("express");
const router = express.Router();
const userController = require("./user");
const  authJWT= require('../../middleware/authJWT');

router.post("", userController.userCreate);
router.get("", userController.userList);
router.get("/:userId", userController.userRead);
router.patch("/:userId", authJWT, userController.userUpdate);
router.delete("/:userId", userController.userDelete);

router.get("/:userId/pets", userController.petRead);
router.post("/:userId/pets", userController.petCreate);
router.patch("/:userId/pets/:petId", userController.petUpdate);

module.exports = router;