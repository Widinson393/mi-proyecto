const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ mensaje: "ESTE ES ADMIN" });
});

module.exports = router;