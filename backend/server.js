const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const alumnoRoutes = require("./routes/alumno.routes");
const examenesRoutes = require("./routes/examenes.routes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alumno", alumnoRoutes);
app.use("/api/examenes", examenesRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});