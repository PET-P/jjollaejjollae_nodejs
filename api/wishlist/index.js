const express = require("express");
const router = express.Router();
const wishlistController = require("./wishlist");
const {authJWT} = require('../../middleware/authJWT');

router.post("", wishlistController.folderCreate);
router.get("", wishlistController.folderList);
router.get("/:userId", authJWT, wishlistController.folderRead);
router.patch("/:userId", authJWT, wishlistController.folderUpdate); //query folderId
router.delete("/:userId", authJWT, wishlistController.folderDelete);//query folderId

router.post('/folder/', authJWT, wishlistController.wishAdd);
router.delete('/folder/:userId', authJWT, wishlistController.wishDelete); //query folderId,placeId
router.get('/folder/:userId', authJWT, wishlistController.wishRead) // query folderId

router.get('/:userId/places',authJWT,wishlistController.totalList); // 모아보기
router.delete('/folder/:userId/:placeId', authJWT, wishlistController.wishDeleteById); //query folderId,placeId

module.exports = router;