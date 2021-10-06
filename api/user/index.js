const express = require("express");
const router = express.Router();
const userController = require("./user");

router.post("", userController.userCreate);
router.get("", userController.userList);
router.get("/:id", userController.userRead);
router.patch("/:id", userController.userUpdate);
router.delete("/:id", userController.userDelete);

router.get("/:id/pets",userController.petRead);
router.post("/:id/pets",userController.petCreate);
router.patch("/:userId/pets/:petId",userController.petUpdate);

module.exports = router;