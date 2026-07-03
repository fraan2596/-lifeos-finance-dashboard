const API_URL = "/api/notion";

async function cargarDashboard() {

  try {

    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const json = await respuesta.json();

    console.log(json);

    actualizarDashboard(json.datos);

  } catch (error) {

    console.error(error);

    document.getElementById("estado").textContent =
      "❌ Error cargando datos";

  }

}

function actualizarDashboard(datos) {

  const resumen = datos.resumen;

  document.getElementById("patrimonio").textContent =
    formatearDinero(resumen.patrimonio);

  document.getElementById("cuentas").textContent =
    resumen.totalCuentas;

  document.getElementById("movimientos").textContent =
    resumen.totalMovimientos;

  document.getElementById("categorias").textContent =
    resumen.totalCategorias;

  document.getElementById("presupuestos").textContent =
    resumen.totalPresupuestos;

  document.getElementById("liquidez").textContent =
    formatearDinero(resumen.patrimonio);

  let estado = "🟢 Saludable";

  if (resumen.patrimonio < 0)
    estado = "🔴 Patrimonio negativo";

  document.getElementById("estado").textContent =
    estado;

  generarAlertas(resumen);

}

function generarAlertas(resumen) {

  const alertas = [];

  if (resumen.totalMovimientos === 0) {
    alertas.push("⚠️ No hay movimientos registrados.");
  }

  if (resumen.totalPresupuestos === 0) {
    alertas.push("📑 No hay presupuestos creados.");
  }

  if (resumen.totalCategorias === 0) {
    alertas.push("📂 No hay categorías creadas.");
  }

  if (resumen.totalCuentas === 0) {
    alertas.push("🏦 No hay cuentas registradas.");
  }

  if (resumen.patrimonio < 0) {
    alertas.push("🔴 Tu patrimonio es negativo.");
  }

  document.getElementById("alertas").innerHTML =
    alertas.length
      ? alertas.join("<br>")
      : "✅ Todo correcto.";
}

function formatearDinero(valor) {

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(valor);

}

document.addEventListener("DOMContentLoaded", () => {

  cargarDashboard();

});
