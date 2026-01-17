const API_URL = "http://localhost:3000/api/auth";

// REGISTRO
async function registrar() {
  const cedula = document.getElementById("cedula").value;
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cedula,
      nombre,
      correo,
      password
    })
  });

  const data = await res.json();
  document.getElementById("respuesta").innerText = data.mensaje;
}

// LOGIN
async function login() {
  const cedula = document.getElementById("cedula").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cedula,
      password
    })
  });

  const data = await res.json();
  document.getElementById("respuesta").innerText = data.mensaje;
}