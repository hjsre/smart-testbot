(function () {
    let actions = [];

    function recordAction(type, selector, value = null) {
        actions.push({ type, selector, value, timestamp: Date.now() });
        chrome.storage.local.set({ actions });
    }

    document.addEventListener('click', (e) => {
        const selector = getUniqueSelector(e.target);
        recordAction('click', selector);
    });

    document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const selector = getUniqueSelector(e.target);
            recordAction('type', selector, e.target.value);
        }
    });

    function getUniqueSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.className) return `${el.tagName.toLowerCase()}.${el.className.trim().replace(/\s+/g, '.')}`;
        return el.tagName.toLowerCase();
    }
})();
