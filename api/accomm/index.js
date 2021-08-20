const express = require("express");
const router = express.Router();
const accommController = require("./accomm");

router.post("", accommController.accommCreate);
router.get("", accommController.accommList);
router.get("/:id", accommController.accommRead);
router.patch("/:id", accommController.accommUpdate);
router.delete("/:id", accommController.accommDelete);

module.exports = router;