import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default async function handler(req, res) {
  try {
    const response = await notion.search({
      page_size: 100,
    });

    const resultado = response.results.map((item) => ({
      id: item.id,
      object: item.object,
      title:
        item.title?.[0]?.plain_text ||
        item.properties?.title?.title?.[0]?.plain_text ||
        item.url ||
        "Sin título"
    }));

    res.status(200).json(resultado);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
