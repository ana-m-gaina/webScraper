const express = require("express");
const router = express.Router();
const {
  getSinglePage,
  getSinglePageFromScript,
  getPages,
  getAllFromScript,
  getAll,
} = require("./controllers/dataController");

router.get("/data", getSinglePage);
router.get("/data-from-script", getSinglePageFromScript);
router.get("/pages", getPages);
router.get("/getAll", getAll);
router.get("/get-all-from-script", getAllFromScript);

module.exports = router;
