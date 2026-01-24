const API = "http://localhost:3000/api/alumno/examenes";
const contenedor = document.getElementById("lista-examenes");

fetch(API)
  .then(res => res.json())
  .then(data => {
    if (data.length === 0) {
      contenedor.innerHTML = "<p>No hay exámenes disponibles.</p>";
      return;
    }

    data.forEach(examen => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${examen.titulo}</h3>
        <p>${examen.descripcion}</p>
        <button onclick="abrirExamen(${examen.id})">Abrir examen</button>
        <hr>
      `;
      contenedor.appendChild(div);
    });
  })
  .catch(err => {
    console.error("❌ Error cargando exámenes:", err);
    contenedor.innerHTML = "<p>Error al cargar exámenes.</p>";
  });

function abrirExamen(id) {
  window.location.href = `resolver.html?examen_id=${id}`;
}