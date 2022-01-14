const express = require("express");
const router = express.Router();
const ReviewController = require("./review");
const { authJWT, optionalAuthJWT } = require('../../middleware/authJWT');

router.post("/:id/like", authJWT, ReviewController.reviewLike);
router.delete("/:id/like", authJWT, ReviewController.reviewLikeDelete);

router.post("/", authJWT, ReviewController.reviewCreate);
router.get("/", optionalAuthJWT, ReviewController.reviewList);
// router.get("/:id", ReviewController.reviewRead);
// router.patch("/:id",authJWT, ReviewController.reviewUpdate);
router.delete("/:id", authJWT, ReviewController.reviewDelete);

router.post('/report', authJWT, ReviewController.reviewReport);
module.exports = router;