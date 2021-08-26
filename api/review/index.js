const express = require("express");
const router = express.Router();
const accommReviewController = require("./accomm");
const cafeReviewController = require("./cafe");
const restaurantReviewController = require("./restaurant");
const spotReviewController = require("./spot");
const image = require('../../middleware/image')

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post("/accomm", upload.array('image'), image.saveMultiImage, accommReviewController.reviewCreate);
router.get("/accomm", accommReviewController.reviewList);
router.get("/accomm/:id", accommReviewController.reviewRead);
router.patch("/accomm/:id", accommReviewController.reviewUpdate);
router.delete("/accomm/:id", accommReviewController.reviewDelete, image.deleteMultiImage);

router.post("/cafe", upload.array('image'), image.saveMultiImage, cafeReviewController.reviewCreate);
router.get("/cafe", cafeReviewController.reviewList);
router.get("/cafe/:id", cafeReviewController.reviewRead);
router.patch("/cafe/:id", cafeReviewController.reviewUpdate);
router.delete("/cafe/:id", cafeReviewController.reviewDelete, image.deleteMultiImage);

router.post("/restaurant", upload.array('image'), image.saveMultiImage, restaurantReviewController.reviewCreate);
router.get("/restaurant", restaurantReviewController.reviewList);
router.get("/restaurant/:id", restaurantReviewController.reviewRead);
router.patch("/restaurant/:id", restaurantReviewController.reviewUpdate);
router.delete("/restaurant/:id", restaurantReviewController.reviewDelete, image.deleteMultiImage);

router.post("/spot", upload.array('image'), image.saveMultiImage, spotReviewController.reviewCreate);
router.get("/spot", spotReviewController.reviewList);
router.get("/spot/:id", spotReviewController.reviewRead);
router.patch("/spot/:id", spotReviewController.reviewUpdate);
router.delete("/spot/:id", spotReviewController.reviewDelete, image.deleteMultiImage);

module.exports = router;