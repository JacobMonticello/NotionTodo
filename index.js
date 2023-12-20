require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const pageId = process.env.PAGE_ID



async function appendCompletedItem(content) {
    await notion.blocks.children.append({
        block_id: pageId,
        children: [
        {
            object: 'block',
            type: 'to_do',
            to_do: {
                rich_text: [{
                    type: 'text',
                    text: {
                        content: content,
                    },
                },],
                checked: true,
            },
        },
        ],
  });
}

async function run() {
    try {
        const response = await notion.blocks.children.list({
            block_id: pageId
        });
        await appendCompletedItem("test");
        console.log(response.results);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}



run();
