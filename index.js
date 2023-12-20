require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const pageId = process.env.PAGE_ID

//Go through all to_do objects and delete them if checked. Stop after reaching divider object
async function clearCompletedItems(todoList) {
    clearedTodosRichText = [];
    for (const todo of todoList) {
        console.log(todo.type);
        if (todo.type === 'divider') {
            break;
        } else if (todo.type == 'to_do') {
            if (todo.to_do.checked === true) {
                const response = await notion.blocks.delete({
                    block_id: todo.id,
                });
                clearedTodosRichText.push(todo.to_do.rich_text);
            }
        }
    }

    return clearedTodosRichText;
}

async function appendCompletedItem(clearedTodosRichText) {
    for (const todoText of clearedTodosRichText) {
        await notion.blocks.children.append({
            block_id: pageId,
            children: [{
                object: 'block',
                type: 'to_do',
                to_do: {
                    rich_text: todoText,
                    checked: true,
                },
            },],
        });
    }
}

async function run() {
    try {
        const pageChildren = await notion.blocks.children.list({
            block_id: pageId
        });
        const clearedTodosRichText = await clearCompletedItems(pageChildren.results);
        await appendCompletedItem(clearedTodosRichText);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

run();