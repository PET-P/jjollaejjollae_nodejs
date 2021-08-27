const express = require("express");
const router = express.Router();
const postController = require("./post");
const image = require('../../middlewares/image')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post("", upload.single('image'), image.saveImage, postController.postCreate);
router.get("", postController.postList);
router.get("/:id", postController.postRead);
router.patch("/:id", postController.postUpdate);
router.delete("/:id", postController.postDelete, image.deleteImage);

module.exports = router;