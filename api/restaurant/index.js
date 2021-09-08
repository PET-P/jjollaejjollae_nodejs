const express = require("express");
const router = express.Router();
const restaurantController = require("./restaurant");
const image = require('../../middleware/image')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post("", upload.single('image'), image.saveImage, restaurantController.restaurantCreate);
router.get("", restaurantController.restaurantList);
router.get("/:id", restaurantController.restaurantRead);
router.patch("/:id", restaurantController.restaurantUpdate);
router.delete("/:id", restaurantController.restaurantDelete, image.deleteImage);

module.exports = router;