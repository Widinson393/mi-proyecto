const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Crear examen (solo admin)
router.post("/crear", async (req, res) => {
  try {
    const { titulo, descripcion, creado_por } = req.body;

    if (!titulo || !creado_por) {
      return res.json({ mensaje: "Faltan datos" });
    }

    const resultado = await pool.query(
      "INSERT INTO examenes (titulo, descripcion, creado_por) VALUES ($1, $2, $3) RETURNING *",
      [titulo, descripcion, creado_por]
    );

    res.json({ mensaje: "Examen creado", examen: resultado.rows[0] });

  } catch (error) {
    console.error("❌ ERROR CREAR EXAMEN:", error.message);
    res.status(500).json({ mensaje: "Error al crear examen" });
  }
});

// Agregar pregunta a examen
router.post("/agregar-pregunta", async (req, res) => {
  try {
    const { texto, opcion_a, opcion_b, opcion_c, opcion_d, correcta, examen_id } = req.body;

    if (!texto || !opcion_a || !opcion_b || !opcion_c || !opcion_d || !correcta || !examen_id) {
      return res.json({ mensaje: "Faltan datos" });
    }

    await pool.query(
      "INSERT INTO preguntas (texto, opcion_a, opcion_b, opcion_c, opcion_d, correcta, examen_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [texto, opcion_a, opcion_b, opcion_c, opcion_d, correcta, examen_id]
    );

    res.json({ mensaje: "Pregunta agregada correctamente" });

  } catch (error) {
    console.error("❌ ERROR AGREGAR PREGUNTA:", error.message);
    res.status(500).json({ mensaje: "Error al agregar pregunta" });
  }
});

// Listar exámenes
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM examenes ORDER BY id DESC");
    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ ERROR LISTAR EXAMENES:", error.message);
    res.status(500).json({ mensaje: "Error al listar exámenes" });
  }
});

// Obtener preguntas de un examen
router.get("/:id/preguntas", async (req, res) => {
  try {
    const examen_id = req.params.id;
    const resultado = await pool.query(
      "SELECT * FROM preguntas WHERE examen_id = $1",
      [examen_id]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ ERROR OBTENER PREGUNTAS:", error.message);
    res.status(500).json({ mensaje: "Error al obtener preguntas" });
  }
});

module.exports = router;