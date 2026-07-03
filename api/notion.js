import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default async function handler(req, res) {
  try {
    const response = await notion.databases.retrieve({
      database_id: "39269496804b80d7a237ddad1ea20f58"
    });

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
