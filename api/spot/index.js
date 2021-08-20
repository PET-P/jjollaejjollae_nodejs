const express = require("express");
const router = express.Router();
const spotController = require("./spot");

router.post("", spotController.spotCreate);
router.get("", spotController.spotList);
router.get("/:id", spotController.spotRead);
router.patch("/:id", spotController.spotUpdate);
router.delete("/:id", spotController.spotDelete);

module.exports = router;