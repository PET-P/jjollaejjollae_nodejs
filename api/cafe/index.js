const express = require("express");
const router = express.Router();
const cafeController = require("./cafe");

router.post("", cafeController.cafeCreate);
router.get("", cafeController.cafeList);
router.get("/:id", cafeController.cafeRead);
router.patch("/:id", cafeController.cafeUpdate);
router.delete("/:id", cafeController.cafeDelete);

module.exports = router;