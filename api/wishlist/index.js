const express = require("express");
const router = express.Router();
const wishlistController = require("./wishlist");

router.post("", wishlistController.folderCreate);
router.get("", wishlistController.folderList);
router.get("/:userId", wishlistController.folderRead);
router.patch("/:userId", wishlistController.folderUpdate); //query folderId
router.delete("/:userId", wishlistController.folderDelete);//query folderId

router.post('/folder/', wishlistController.wishAdd);
router.delete('/folder/:userId', wishlistController.wishDelete); //query folderId,placeId
router.get('/folder/:userId',wishlistController.wishRead) // query folderId



module.exports = router;