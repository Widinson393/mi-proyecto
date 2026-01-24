const express = require("express");
const router = express.Router();

console.log("🟢 examenes.routes.js cargado");

router.get("/test", (req, res) => {
  res.json({ mensaje: "Ruta examenes funcionando" });
});

module.exports = router;