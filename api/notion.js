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

async function leerBase(databaseId) {
  let results = [];
  let cursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });

    results.push(...response.results);

    cursor = response.has_more
      ? response.next_cursor
      : undefined;

  } while (cursor);

  return results;
}

function texto(prop) {
  if (!prop) return "";

  if (prop.title)
    return prop.title.map(t => t.plain_text).join("");

  if (prop.rich_text)
    return prop.rich_text.map(t => t.plain_text).join("");

  return "";
}

function numero(prop) {
  if (!prop) return 0;
  return prop.number ?? 0;
}

function seleccion(prop) {
  if (!prop) return "";
  return prop.select?.name ?? "";
}

function checkbox(prop) {
  if (!prop) return false;
  return prop.checkbox ?? false;
}

function fecha(prop) {
  if (!prop) return null;
  return prop.date?.start ?? null;
}

async function obtenerDatos() {

  const [
    cuentas,
    categorias,
    movimientos,
    presupuestos
  ] = await Promise.all([

    leerBase(DATABASES.cuentas),
    leerBase(DATABASES.categorias),
    leerBase(DATABASES.movimientos),
    leerBase(DATABASES.presupuestos)

  ]);

  return {

    cuentas,
    categorias,
    movimientos,
    presupuestos,

    resumen: {

      totalCuentas: cuentas.length,
      totalCategorias: categorias.length,
      totalMovimientos: movimientos.length,
      totalPresupuestos: presupuestos.length,

      patrimonio: cuentas.reduce((sum, page) => {

        const saldo = Object.values(page.properties)
          .find(p => p.type === "number");

        return sum + (saldo?.number ?? 0);

      }, 0)

    }

  };

}

export default async function handler(req, res) {

  try {

    const datos = await obtenerDatos();

    res.status(200).json({
      ok: true,
      actualizado: new Date().toISOString(),
      datos
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message,
      stack: error.stack
    });

  }

}
