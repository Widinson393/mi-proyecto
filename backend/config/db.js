// CONEXIÓN A POSTGRESQL (NO MONGODB)
const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',        // 👈 TU USUARIO POSTGRES
  password: '1998', // 👈 TU CONTRASEÑA POSTGRES
  database: 'plataforma_examenes'
})

module.exports = pool