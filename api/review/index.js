const express = require("express");
const router = express.Router();
const ReviewController = require("./review");
const image = require('../../middleware/image')
const authJWT = require('../../middleware/authJWT');

router.post("/", authJWT, ReviewController.reviewCreate);
router.get("/", ReviewController.reviewList);
router.get("/:id", ReviewController.reviewRead);
router.patch("/:id",authJWT, ReviewController.reviewUpdate);
router.delete("/:id",authJWT, ReviewController.reviewDelete);

module.exports = router;