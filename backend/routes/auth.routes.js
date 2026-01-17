const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// REGISTRO DE USUARIO
router.post("/registro", async (req, res) => {
  try {
    const { cedula, nombre, correo, password } = req.body;

    // 1️⃣ Validar campos
    if (!cedula || !nombre || !correo || !password) {
      return res.json({ mensaje: "Faltan datos" });
    }

    // 2️⃣ Validar cédula (10 números)
    if (!/^\d{10}$/.test(cedula)) {
      return res.json({ mensaje: "Cédula inválida" });
    }

    // 3️⃣ Verificar si la cédula ya existe
    const cedulaExiste = await pool.query(
      "SELECT id FROM usuarios WHERE cedula = $1",
      [cedula]
    );

    if (cedulaExiste.rows.length > 0) {
      return res.json({ mensaje: "Esta cédula ya está registrada" });
    }

    // 4️⃣ Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // 5️⃣ Guardar usuario
    await pool.query(
      "INSERT INTO usuarios (cedula, nombre, correo, password) VALUES ($1, $2, $3, $4)",
      [cedula, nombre, correo, passwordHash]
    );

    res.json({ mensaje: "Usuario registrado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en registro" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { cedula, password } = req.body;

    // 1️⃣ Validar datos
    if (!cedula || !password) {
      return res.json({ mensaje: "Faltan datos" });
    }

    // 2️⃣ Buscar usuario por cédula
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE cedula = $1",
      [cedula]
    );

    if (resultado.rows.length === 0) {
      return res.json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = resultado.rows[0];

    // 3️⃣ Comparar contraseñas
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.json({ mensaje: "Contraseña incorrecta" });
    }

    // 4️⃣ Login exitoso
    res.json({
  mensaje: "Login exitoso",
  usuario: {
    id: usuario.id,
    cedula: usuario.cedula,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol // 👈 MUY IMPORTANTE
  }
});

  } catch (error) {
  console.error("ERROR REGISTRO:", error.message);
  res.status(500).json({ mensaje: "Error interno del servidor" });
}
});

module.exports = router;