async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password })
  });

  const data = await res.json();

  if (data.rol === "admin") {
    alert("Bienvenido ADMIN");
  } else {
    alert("Bienvenido ALUMNO");
  }
}