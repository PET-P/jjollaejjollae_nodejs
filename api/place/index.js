const express = require("express");
const router = express.Router();
const placeController = require("./place");
const image = require('../../middleware/image')

router.post("",  placeController.placeCreate);
router.get("", placeController.placeList);
router.get("/:id", placeController.placeRead);
router.patch("/:id", placeController.placeUpdate);
router.delete("/:id", placeController.placeDelete);

module.exports = router;