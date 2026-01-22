const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // ← CORRECTO

router.get("/test", (req, res) => {
  res.json({ mensaje: "ESTE ES ALUMNO" });
});

// Obtener todos los exámenes disponibles
router.get("/examenes", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM examenes ORDER BY id DESC");
    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ ERROR OBTENER EXÁMENES:", error.message);
    res.status(500).json({ mensaje: "Error al obtener exámenes" });
  }
});

// Obtener preguntas de un examen
router.get("/examenes/:id", async (req, res) => {
  try {
    const examen_id = req.params.id;
    const resultado = await pool.query(
      "SELECT id, texto, opcion_a, opcion_b, opcion_c, opcion_d FROM preguntas WHERE examen_id = $1",
      [examen_id]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ ERROR OBTENER PREGUNTAS:", error.message);
    res.status(500).json({ mensaje: "Error al obtener preguntas" });
  }
});

// Enviar respuestas del alumno
router.post("/examenes/:id/responder", async (req, res) => {
  try {
    const examen_id = req.params.id;
    const { alumno_id, respuestas } = req.body;

    if (!alumno_id || !respuestas || !Array.isArray(respuestas)) {
      return res.json({ mensaje: "Datos incompletos" });
    }

    let correctas = 0;

    for (let r of respuestas) {
      const result = await pool.query(
        "SELECT correcta FROM preguntas WHERE id = $1",
        [r.pregunta_id]
      );

      if (result.rows[0].correcta === r.respuesta) {
        correctas++;
      }
    }

    const total = respuestas.length;
    const nota = Math.round((correctas / total) * 10);

    await pool.query(
      "INSERT INTO resultados (alumno_id, examen_id, nota) VALUES ($1, $2, $3)",
      [alumno_id, examen_id, nota]
    );

    res.json({ mensaje: "Examen enviado", nota });

  } catch (error) {
    console.error("❌ ERROR ENVIAR EXAMEN:", error.message);
    res.status(500).json({ mensaje: "Error al enviar examen" });
  }
});

module.exports = router;