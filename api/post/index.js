const express = require("express");
const router = express.Router();
const postController = require("./post");
const postImageController = require("./image");

const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()})

router.post("", upload.single('image'), postController.postCreate);
router.get("", postController.postList);
router.get("/image", postImageController.postImageList);
router.get("/:id", postController.postRead);
router.get("/image/:id", postImageController.postImageRead);
router.patch("/:id", postController.postUpdate);
router.delete("/:id", postController.postDelete);

module.exports = router;