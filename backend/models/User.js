const mongoose = require("mongoose");

// Modelo de usuario
const UserSchema = new mongoose.Schema({
  cedula: {
    type: String,
    unique: true, // No se puede repetir
    required: true
  },
  usuario: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true // Se guarda encriptada
  },
  rol: {
    type: String,
    enum: ["admin", "alumno"],
    default: "alumno"
  }
});

module.exports = mongoose.model("User", UserSchema);