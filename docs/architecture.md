## Local Test Generator Flow (v0.1)

1. User runs `generateTest.js` using `node src/backend/generateTest.js`
2. Script prompts for natural-language input
3. Local LLM (Ollama via llama3) receives structured prompt
4. Response is printed as Playwright test code
