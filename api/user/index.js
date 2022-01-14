const express = require("express");
const router = express.Router();
const userController = require("./user");
const { authJWT } = require('../../middleware/authJWT');

router.post("", userController.userCreate);
// router.get("", userController.userList);
router.get("/:userId", authJWT, userController.userRead);
router.patch("/:userId", authJWT, userController.userUpdate);
router.delete("/:userId", authJWT, userController.userDelete);

router.get("/:userId/pets", authJWT, userController.petRead);
router.post("/:userId/pets", authJWT, userController.petCreate);
router.patch("/:userId/pets/:petId", authJWT, userController.petUpdate);
router.delete("/:userId/pets/:petId", authJWT, userController.petDelete);


module.exports = router;