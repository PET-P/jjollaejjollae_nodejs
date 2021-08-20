const express = require("express");
const router = express.Router();
const imageController = require("./image");

router.get("", imageController.imageList);
router.get("/:id", imageController.imageRead);
router.delete("/:id", imageController.imageDelete);

module.exports = router;