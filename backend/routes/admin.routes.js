const express = require("express");
const router = express.Router();

console.log("🟢 admin.routes.js cargado");

router.get("/test", (req, res) => {
  res.json({ mensaje: "Ruta admin funcionando" });
});

module.exports = router;