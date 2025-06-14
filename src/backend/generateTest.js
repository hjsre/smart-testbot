import fetch from 'node-fetch';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Describe your test case: ', (userInput) => {
    rl.question('Which framework? (playwright/cypress): ', async (frameworkInput) => {
        const framework = frameworkInput.toLowerCase() === 'cypress' ? 'Cypress' : 'Playwright';
        const prompt = `You are a senior QA engineer. Convert the following user story into a ${framework} test. Do not explain anything, just return the test code:\n\n${userInput}`;

        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3',
                prompt,
                stream: false
            })
        });

        const data = await response.json();
        const testCode = data.response;

        console.log(`\n✅ ${framework} Test Code:\n`);
        console.log(testCode);

        const outputDir = path.join(process.cwd(), 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const filenameSlug = userInput
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const filePath = path.join(outputDir, `${filenameSlug}.${framework.toLowerCase()}.spec.js`);
        fs.writeFileSync(filePath, testCode);
        console.log(`\n📂 Saved to: ${filePath}`);

        rl.close();
    });
});
