const express = require("express");
const router = express.Router();
const restaurantController = require("./restaurant");

router.post("", restaurantController.restaurantCreate);
router.get("", restaurantController.restaurantList);
router.get("/:id", restaurantController.restaurantRead);
router.patch("/:id", restaurantController.restaurantUpdate);
router.delete("/:id", restaurantController.restaurantDelete);

module.exports = router;