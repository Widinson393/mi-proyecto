const express = require("express");
const router = express.Router();

// Ruta SOLO para admin
router.get("/dashboard", (req, res) => {
  const { rol } = req.body; // por ahora lo mandamos desde el cliente

  if (rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }

  res.json({ mensaje: "Bienvenido administrador" });
});

module.exports = router;