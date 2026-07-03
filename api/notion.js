import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default async function handler(req, res) {
  try {

    const blocks = await notion.blocks.children.list({
      block_id: "38c69496-804b-807e-9551-d93fd30f4cb8"
    });

    res.status(200).json(blocks.results);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
}
