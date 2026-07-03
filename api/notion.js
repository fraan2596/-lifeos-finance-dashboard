import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default async function handler(req, res) {
  try {
    const response = await notion.search({
      page_size: 100,
    });

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
