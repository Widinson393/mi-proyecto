const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth.routes");
const alumnoRoutes = require("./routes/alumno.routes");
const adminRoutes = require("./routes/admin.routes");
const examenesRoutes = require("./routes/examenes.routes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/alumno", alumnoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/examenes", examenesRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});