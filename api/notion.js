import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASES = {
  cuentas: "39269496-804b-8036-9e2d-c8b25134ee2d",
  categorias: "38c69496-804b-80ca-b88b-c8a1759f4529",
  movimientos: "38c69496-804b-80f1-a428-e506fc346c7c",
  presupuestos: "38f69496-804b-80a6-8a42-f34225e8acf9",
};

async function obtenerTodos(databaseId) {
  let resultados = [];
  let cursor = undefined;

  do {
    const respuesta = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      start_cursor: cursor,
    });

    resultados.push(...respuesta.results);

    cursor = respuesta.has_more
      ? respuesta.next_cursor
      : undefined;

  } while (cursor);

  return resultados;
}

function titulo(propiedad) {
  return propiedad?.title?.[0]?.plain_text ?? "";
}

function texto(propiedad) {
  return propiedad?.rich_text?.[0]?.plain_text ?? "";
}

function numero(propiedad) {
  return propiedad?.number ?? 0;
}

function formulaNumero(propiedad) {
  return propiedad?.formula?.number ?? 0;
}

function seleccion(propiedad) {
  return propiedad?.select?.name ?? "";
}

function fecha(propiedad) {
  return propiedad?.date?.start ?? null;
}

async function cargarLifeOS() {
  const [
    cuentasRaw,
    categoriasRaw,
    movimientosRaw,
    presupuestosRaw
  ] = await Promise.all([
    obtenerTodos(DATABASES.cuentas),
    obtenerTodos(DATABASES.categorias),
    obtenerTodos(DATABASES.movimientos),
    obtenerTodos(DATABASES.presupuestos)
  ]);

  const cuentas = cuentasRaw.map(cuenta => ({
    id: cuenta.id,

    nombre:
      titulo(cuenta.properties["Nombre"]),

    entidad:
      texto(cuenta.properties["Entidad"]),

    tipo:
      seleccion(cuenta.properties["Tipo"]),

    saldoInicial:
      numero(cuenta.properties["Saldo inicial"]),

    saldoActual:
      formulaNumero(cuenta.properties["Saldo Actual"]),

    bancoPrincipal:
      cuenta.properties["Banco principal"]?.checkbox ?? false
  }));

  const patrimonio = cuentas.reduce(
    (total, cuenta) => total + cuenta.saldoActual,
    0
  );

  const categorias = categoriasRaw.map(categoria => ({
    id: categoria.id,

    nombre:
      titulo(categoria.properties["Nombre"]),

    tipo:
      seleccion(categoria.properties["Tipo"]),

    color:
      seleccion(categoria.properties["Color"]) || null,
  }));

  const movimientos = movimientosRaw.map(mov => ({
    id: mov.id,

    descripcion:
      titulo(mov.properties["Descripción"]) ||
      texto(mov.properties["Descripción"]),

    importe:
      numero(mov.properties["Importe"]),

    tipo:
      seleccion(mov.properties["Tipo"]),

    fecha:
      fecha(mov.properties["Fecha"]),

    cuenta:
      mov.properties["Cuenta"]?.relation?.[0]?.id ?? null,

    categoria:
      mov.properties["Categoría"]?.relation?.[0]?.id ?? null,

    esRecurrente:
      mov.properties["Recurrente"]?.checkbox ?? false,
  }));

  const presupuestos = presupuestosRaw.map(pre => ({
    id: pre.id,

    nombre:
      titulo(pre.properties["Nombre"]),

    categoria:
      pre.properties["Categoría"]?.relation?.[0]?.id ?? null,

    importeLimite:
      numero(pre.properties["Límite"]),

    gastado:
      formulaNumero(pre.properties["Gastado"]) ?? 0,

    periodo:
      seleccion(pre.properties["Periodo"]),
  }));

  return {
    cuentas,
    categorias,
    movimientos,
    presupuestos,
    patrimonio,
  };
}

export async function getLifeOS() {
  return await cargarLifeOS();
}
