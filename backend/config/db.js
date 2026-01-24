const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       // tu usuario de postgres
  host: "localhost",
  database: "plataforma_examenes",  // nombre de tu base de datos
  password: "1998",      // tu contraseña real
  port: 5432,
});

pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch(err => console.error("❌ Error al conectar a PostgreSQL:", err));

module.exports = pool;
