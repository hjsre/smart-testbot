import fetch from 'node-fetch'; // or use axios
import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Describe your test case: ', async (userInput) => {
    const prompt = `You are a senior QA engineer. Convert the following user story into a Playwright test. Do not explain anything, just return the test code:\n\n${userInput}`;

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


    console.log('\n✅ Generated Test Code:\n');
    console.log(testCode);

    // Create output directory if needed
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Create filename from input
    const filenameSlug = userInput
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Convert to kebab-case
        .replace(/-+/g, '-')         // Remove multiple dashes
        .replace(/^-|-$/g, '');      // Trim dashes
    const filePath = path.join(outputDir, `${filenameSlug}.spec.js`);

    fs.writeFileSync(filePath, testCode);
    console.log(`\n📂 Test saved to: ${filePath}`);

    rl.close();
});