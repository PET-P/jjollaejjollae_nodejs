const express = require("express");
const router = express.Router();
const placeController = require("./place");
const image = require('../../middleware/image')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post("", upload.array('image'), image.saveMultiImage, placeController.placeCreate);
router.get("", placeController.placeList);
router.get("/:id", placeController.placeRead);
router.patch("/:id", placeController.placeUpdate);
router.delete("/:id", placeController.placeDelete, image.deleteMultiImage);

module.exports = router;