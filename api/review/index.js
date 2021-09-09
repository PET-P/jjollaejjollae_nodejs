const express = require("express");
const router = express.Router();
const ReviewController = require("./review");
const image = require('../../middleware/image')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post("/", upload.array('image'), image.saveMultiImage, ReviewController.reviewCreate);
router.get("/", ReviewController.reviewList);
router.get("/:id", ReviewController.reviewRead);
router.patch("/:id", ReviewController.reviewUpdate);
router.delete("/:id", ReviewController.reviewDelete, image.deleteMultiImage);

module.exports = router;