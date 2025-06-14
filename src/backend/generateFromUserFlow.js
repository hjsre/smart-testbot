import fs from 'fs';
import path from 'path';
import os from 'os';
import fetch from 'node-fetch';
import readline from 'readline';

const downloadsDir = path.join(os.homedir(), 'Downloads');

function getLatestUserFlowFile() {
    const files = fs.readdirSync(downloadsDir)
        .filter(name => name.startsWith('user-flow') && name.endsWith('.json'))
        .map(name => ({
            name,
            time: fs.statSync(path.join(downloadsDir, name)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

    return files.length > 0 ? path.join(downloadsDir, files[0].name) : null;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Which framework? (playwright/cypress): ', async (frameworkInput) => {
    const framework = frameworkInput.toLowerCase() === 'cypress' ? 'Cypress' : 'Playwright';

    const filePath = getLatestUserFlowFile();
    if (!filePath) {
        console.error('❌ No user-flow file found in Downloads.');
        rl.close();
        return;
    }

    const actions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const formattedFlow = actions.map(a => {
        if (a.type === 'click') return `Click on ${a.selector}`;
        if (a.type === 'type') return `Type "${a.value}" into ${a.selector}`;
        return '';
    }).join('\n');

    const prompt = `You are a senior QA engineer. Convert the following user flow into a ${framework} test. Do not include any explanation. Only return valid test code:\n\n${formattedFlow}`;

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

    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const baseName = path.basename(filePath).replace('.json', '').toLowerCase();
    const extension = framework.toLowerCase();
    const outputFile = path.join(outputDir, `${baseName}.${extension}.spec.js`);

    fs.writeFileSync(outputFile, testCode);
    console.log(`✅ ${framework} test generated and saved to: ${outputFile}`);

    rl.close();
});
