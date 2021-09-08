const express = require("express");
const router = express.Router();
const cafeController = require("./cafe");
const image = require('../../middleware/image')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post("", upload.single('image'), image.saveImage, cafeController.cafeCreate);
router.get("", cafeController.cafeList);
router.get("/:id", cafeController.cafeRead);
router.patch("/:id", cafeController.cafeUpdate);
router.delete("/:id", cafeController.cafeDelete, image.deleteImage);

module.exports = router;