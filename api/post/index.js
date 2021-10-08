const express = require("express");
const router = express.Router();
const postController = require("./post");
const image = require('../../middleware/image')

router.post("", postController.postCreate);
router.get("", postController.postList);
router.get("/:id", postController.postRead);
router.patch("/:id", postController.postUpdate);
router.delete("/:id", postController.postDelete);

module.exports = router;