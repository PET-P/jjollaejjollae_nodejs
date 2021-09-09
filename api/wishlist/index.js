const express = require("express");
const router = express.Router();
const wishlistController = require("./wishlist");

router.post("", wishlistController.wishlistCreate);
router.get("", wishlistController.wishlistList);
router.get("/:id", wishlistController.wishlistRead);
router.patch("/:id", wishlistController.wishlistUpdate);
router.delete("/:id", wishlistController.wishlistDelete);

module.exports = router;