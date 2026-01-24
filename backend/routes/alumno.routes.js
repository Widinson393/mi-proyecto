const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ================================
// OBTENER EXÁMENES DISPONIBLES
// ================================
router.get("/examenes", async (req, res) => {
  try {
    const resultado = await db.query("SELECT * FROM examenes ORDER BY id DESC");
    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ ERROR OBTENER EXÁMENES:", error.message);
    res.status(500).json({ mensaje: "Error al obtener exámenes" });
  }
});

// ================================
// GUARDAR RESULTADO DEL ALUMNO
// ================================
router.post("/resultados/:alumno_id", async (req, res) => {
  const alumno_id = req.params.alumno_id;
  const { examen_id, nota } = req.body;

  if (!examen_id || nota === undefined) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const result = await db.query(
      `INSERT INTO resultados (alumno_id, examen_id, nota)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [alumno_id, examen_id, nota]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ ERROR RESULTADOS:", error.message);
    res.status(500).json({ error: "Error al guardar resultados" });
  }
});

// ================================
// OBTENER RESULTADOS DEL ALUMNO
// ================================
router.get("/resultados/:alumno_id", async (req, res) => {
  const alumno_id = req.params.alumno_id;

  try {
    const resultado = await db.query(
      `SELECT r.id, e.titulo, r.nota, r.fecha
       FROM resultados r
       JOIN examenes e ON r.examen_id = e.id
       WHERE r.alumno_id = $1
       ORDER BY r.fecha DESC`,
      [alumno_id]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ ERROR OBTENER RESULTADOS:", error.message);
    res.status(500).json({ error: "Error al obtener resultados" });
  }
});

module.exports = router;