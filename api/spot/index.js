const express = require("express");
const router = express.Router();
const spotController = require("./spot");
const image = require('../../middleware/image')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post("", upload.single('image'), image.saveImage, spotController.spotCreate);
router.get("", spotController.spotList);
router.get("/:id", spotController.spotRead);
router.patch("/:id", spotController.spotUpdate);
router.delete("/:id", spotController.spotDelete, image.deleteImage);

module.exports = router;