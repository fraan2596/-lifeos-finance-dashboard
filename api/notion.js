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

async function propiedades(databaseId) {

  const respuesta = await notion.databases.query({
    database_id: databaseId,
    page_size: 1
  });

  if (!respuesta.results.length) {
    return {};
  }

  return respuesta.results[0].properties;

}

async function obtenerEstructura() {

  const [
    cuentas,
    categorias,
    movimientos,
    presupuestos

  ] = await Promise.all([

    propiedades(DATABASES.cuentas),
    propiedades(DATABASES.categorias),
    propiedades(DATABASES.movimientos),
    propiedades(DATABASES.presupuestos)

  ]);

  return {

    cuentas: Object.fromEntries(
      Object.entries(cuentas).map(([k, v]) => [k, v.type])
    ),

    categorias: Object.fromEntries(
      Object.entries(categorias).map(([k, v]) => [k, v.type])
    ),

    movimientos: Object.fromEntries(
      Object.entries(movimientos).map(([k, v]) => [k, v.type])
    ),

    presupuestos: Object.fromEntries(
      Object.entries(presupuestos).map(([k, v]) => [k, v.type])
    )

  };

}

export default async function handler(req, res) {

  try {

    const estructura = await obtenerEstructura();

    res.status(200).json({
      ok: true,
      estructura
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    });

  }

}
