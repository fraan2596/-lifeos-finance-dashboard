import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASES = {
  cuentas: "39269496804b80d7a237ddad1ea20f58",
  categorias: "38c69496804b80cab88bc8a1759f4529",
  movimientos: "38c69496804b80f1a428e506fc346c7c",
  presupuestos: "38f69496804b80a68a42f34225e8acf9",
};

async function obtenerCuentas() {

  const response = await notion.databases.retrieve({
    database_id: DATABASES.cuentas,
  });

  return response;

}

export default async function handler(req, res) {

  try {

    const cuentas = await obtenerCuentas();

    return res.status(200).json({
      ok: true,
      timestamp: new Date().toISOString(),
      cuentas
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }

}
