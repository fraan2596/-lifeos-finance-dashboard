import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default async function handler(req, res) {
  try {

    const response = await notion.databases.query({
      database_id: "39269496-804b-8036-9e2d-c8b25134ee2d"
    });

    res.status(200).json(response);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
}
