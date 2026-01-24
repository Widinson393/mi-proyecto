const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log("🟢 auth.routes.js cargado");

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    console.log("📥 BODY RECIBIDO:", req.body);

    const { nombre, correo, password } = req.body; // ← AQUÍ CAMBIA

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const existe = await pool.query("SELECT * FROM alumnos WHERE correo = $1", [correo]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevo = await pool.query(
      "INSERT INTO alumnos (nombre, correo, password) VALUES ($1, $2, $3) RETURNING id, nombre, correo",
      [nombre, correo, hash]
    );

    res.json({
      mensaje: "Usuario registrado correctamente",
      usuario: nuevo.rows[0]
    });

  } catch (error) {
    console.error("❌ ERROR REGISTRO:", error.message);
    res.status(500).json({ error: "Error al registrar alumno" });
  }
});
// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("📥 LOGIN BODY:", req.body);

    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    const result = await pool.query(
      "SELECT * FROM alumnos WHERE correo = $1",
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const alumno = result.rows[0];

    const valido = await bcrypt.compare(password, alumno.password);
    if (!valido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: alumno.id, rol: "alumno" },
      "secreto123",
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      alumno: {
        id: alumno.id,
        nombre: alumno.nombre,
        correo: alumno.correo
      }
    });

  } catch (error) {
    console.error("❌ ERROR LOGIN:", error.message);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});
module.exports = router;