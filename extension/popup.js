let recording = false;

document.getElementById('start').addEventListener('click', async () => {
    recording = true;
    await chrome.storage.local.set({ actions: [] });
    alert('Recording started');
});

document.getElementById('stop').addEventListener('click', async () => {
    recording = false;
    const { actions } = await chrome.storage.local.get('actions');
    const blob = new Blob([JSON.stringify(actions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url,
        filename: 'user-flow.json'
    });

    alert('Recording stopped and saved as user-flow.json');
});
