const express = require("express");
const router = express.Router();
const keywordController = require("./keyword");

router.get("", keywordController.keywordList);
// router.get("/:id", keywordController.keywordRead);
// router.delete("/:id", keywordController.keywordDelete);

module.exports = router;