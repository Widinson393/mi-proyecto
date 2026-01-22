const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

console.log("🟢 auth.routes.js cargado");

// RUTA DE PRUEBA
router.get("/test", (req, res) => {
  res.json({ mensaje: "Ruta auth funcionando" });
});

// REGISTRO
router.post("/registro", async (req, res) => {
  try {
    const { cedula, nombre, correo, password } = req.body;

    if (!cedula || !nombre || !correo || !password) {
      return res.json({ mensaje: "Faltan datos" });
    }

    if (!/^\d{10}$/.test(cedula)) {
      return res.json({ mensaje: "Cédula inválida" });
    }

    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE cedula = $1",
      [cedula]
    );

    if (existe.rows.length > 0) {
      return res.json({ mensaje: "Esta cédula ya está registrada" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (cedula, nombre, correo, password, rol) VALUES ($1, $2, $3, $4, 'alumno')",
      [cedula, nombre, correo, passwordHash]
    );

    res.json({ mensaje: "Usuario registrado correctamente" });

  } catch (error) {
    console.error("❌ ERROR REGISTRO:", error.message);
    res.status(500).json({ mensaje: "Error en registro" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { cedula, password } = req.body;

    if (!cedula || !password) {
      return res.json({ mensaje: "Faltan datos" });
    }

    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE cedula = $1",
      [cedula]
    );

    if (resultado.rows.length === 0) {
      return res.json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = resultado.rows[0];
    const valido = await bcrypt.compare(password, usuario.password);

    if (!valido) {
      return res.json({ mensaje: "Contraseña incorrecta" });
    }

    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario.id,
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error("❌ ERROR LOGIN:", error.message);
    res.status(500).json({ mensaje: "Error en login" });
  }
});

module.exports = router;