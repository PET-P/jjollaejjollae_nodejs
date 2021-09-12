const express = require("express");
const router = express.Router();
const wishlistController = require("./wishlist");

router.post("", wishlistController.folderCreate);
router.get("", wishlistController.folderList);
router.get("/:user_id", wishlistController.folderRead);
router.patch("/:user_id", wishlistController.folderUpdate); //query folder_id
router.delete("/:user_id", wishlistController.folderDelete);//query folder_id

router.post('/folder/', wishlistController.wishAdd);
router.delete('/folder/:user_id', wishlistController.wishDelete); //query folder_id,place_id
router.get('/folder/:user_id',wishlistController.wishRead) // query folder_id



module.exports = router;