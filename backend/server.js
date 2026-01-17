const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});