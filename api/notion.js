import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 👇 CAMBIA ESTE ID CADA VEZ
const PAGE_ID = "38c69496-804b-807e-9551-d93fd30f4cb8";

export default async function handler(req, res) {
  try {

    const bloques = await notion.blocks.children.list({
      block_id: PAGE_ID,
      page_size: 100
    });

    const databases = bloques.results
      .filter(b => b.type === "child_database")
      .map(b => ({
        id: b.id,
        titulo: b.child_database.title
      }));

    res.status(200).json(databases);

  } catch (error) {

    res.status(500).json({
      ok: false,
      error: error.message
    });

  }
}
