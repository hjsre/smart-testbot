import fetch from 'node-fetch'; // or use axios
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Describe your test case: ', async (userInput) => {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3',
            prompt: `You are a senior QA engineer. Convert this user story to a Playwright test:\n\n${userInput}`,
            stream: false
        })
    });

    const data = await response.json();
    console.log('\nGenerated Test Code:\n');
    console.log(data.response);

    rl.close();
});