const express = require("express");
const router = express.Router();
const accommController = require("./accomm");
const image = require('../../middleware/image')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post("", upload.single('image'), image.saveImage, accommController.accommCreate);
router.get("", accommController.accommList);
router.get("/:id", accommController.accommRead);
router.patch("/:id", accommController.accommUpdate);
router.delete("/:id", accommController.accommDelete, image.deleteImage);

module.exports = router;