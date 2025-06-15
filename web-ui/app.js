document.getElementById('test-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const inputText = document.getElementById('input-text').value.trim();
  const framework = document.getElementById('framework').value;
  const output = document.getElementById('output');
  const downloadBtn = document.getElementById('download-btn');

  if (!inputText) {
    output.textContent = "⚠️ Please provide test input.";
    return;
  }

  output.textContent = "⏳ Generating test code...";

  const prompt = `You are a senior QA engineer. Convert the following input into a ${framework} test. Do not explain anything. Only return valid test code:\n\n${inputText}`;

  try {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3', prompt, stream: false })
    });

    const data = await response.json();
    const code = data.response;

    output.textContent = code;
    downloadBtn.style.display = 'inline-block';

    downloadBtn.onclick = () => {
      const blob = new Blob([code], { type: 'text/javascript' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `smart-testbot.${framework}.spec.js`;
      a.click();
    };
  } catch (err) {
    output.textContent = "❌ Error generating test code.";
    console.error(err);
  }
});
