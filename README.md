# Smart TestBot

**Smart TestBot** is a local AI-powered test generation tool that converts plain English test descriptions into automated test cases using LLMs (currently via [Ollama](https://ollama.com)).

---

## ✅ Getting Started (Free & Local)

### Prerequisites
- Node.js (v18+)
- [Ollama](https://ollama.com/) installed and running locally
- A model like `llama3` pulled

---

### 🛠 Setup Instructions

1. **Install Ollama** (Mac/Linux):
```bash
brew install ollama
```

2. **Run the Model**:
```bash
ollama run llama3
```

This starts Ollama’s local LLM server at: `http://127.0.0.1:11434`

---

### 📁 Folder Structure

```
smart-testbot/
├── docs/
│   ├── architecture.md
│   └── llm-prompts.md
├── src/
│   └── backend/
│       └── generateTest.js
├── tests/
├── .env.example
├── README.md
├── package.json
```

---

### 📜 Usage – Generate a Playwright Test

1. Run the script:
```bash
node src/backend/generateTest.js
```

2. Enter a test description when prompted, e.g.:
```
Log in to Gmail and check for new emails.
```

3. You'll get:
```js
// Playwright test code generated by LLM
```

---

### 🧠 Prompt Used (v0.2)
> "You are a senior QA engineer. Convert the following user story into a Playwright test. Do not explain anything, just return the test code."

---

### 🔧 Troubleshooting

- If you get `ECONNREFUSED ::1:11434`, update the URL in `generateTest.js` to use `127.0.0.1` instead of `localhost`.

```js
const response = await fetch('http://127.0.0.1:11434/api/generate', ...)
```

---

### ✍️ Contributor Notes
- Document all prompt versions in `docs/llm-prompts.md`
- Document flow in `docs/architecture.md`
- All test generation logic is inside `src/backend/generateTest.js`

---

### 📅 Last Updated
June 14, 2025
