const API_URL = "/api/notion";

async function cargarDashboard() {

  try {

    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudo conectar con el backend");
    }

    const datos = await respuesta.json();

    console.log("Datos recibidos:", datos);

    mostrarResumen(datos.datos.resumen);

  } catch (error) {

    console.error(error);

    document.body.innerHTML += `
      <div style="
        background:#ffebee;
        color:#b71c1c;
        padding:20px;
        margin:20px;
        border-radius:12px;
        font-family:sans-serif;
      ">
        Error cargando el Dashboard<br><br>
        ${error.message}
      </div>
    `;

  }

}

function mostrarResumen(resumen) {

  const patrimonio =
    document.getElementById("patrimonio");

  const cuentas =
    document.getElementById("cuentas");

  const movimientos =
    document.getElementById("movimientos");

  const categorias =
    document.getElementById("categorias");

  const presupuestos =
    document.getElementById("presupuestos");

  if (patrimonio)
    patrimonio.textContent =
      formatearDinero(resumen.patrimonio);

  if (cuentas)
    cuentas.textContent =
      formatearNumero(resumen.totalCuentas);

  if (movimientos)
    movimientos.textContent =
      formatearNumero(resumen.totalMovimientos);

  if (categorias)
    categorias.textContent =
      formatearNumero(resumen.totalCategorias);

  if (presupuestos)
    presupuestos.textContent =
      formatearNumero(resumen.totalPresupuestos);

}

document.addEventListener("DOMContentLoaded", () => {

  console.log("🚀 LifeOS Finance iniciado");

  cargarDashboard();

});

// =========================
// FUNCIONES AUXILIARES
// =========================

function formatearDinero(valor) {

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(valor);

}

function formatearNumero(valor) {

  return new Intl.NumberFormat("es-ES").format(valor);

}
