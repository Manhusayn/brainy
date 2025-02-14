// Ensure input field readiness with better detection
const highlightInput = () => {
  const platforms = {
    chatgpt: [
      'textarea#prompt-textarea',
      'div[contenteditable][role="textbox"]'
    ],
    claude: ['div.ProseMirror'],
    perplexity: ['textarea[placeholder="Ask anything..."]'],
    deepseek: ['textarea.input-box']
  };

  const host = window.location.hostname;
  const selectors = Object.values(platforms).flat();
  const inputField = selectors.reduce((found, selector) =>
    found || document.querySelector(selector), null);

  if (inputField) {
    inputField.style.border = '2px solid #4CAF50';
    inputField.dataset.researchExtension = 'ready';
    console.log('Input field verified:', inputField);
  }
};

// Run on load and after DOM changes
new MutationObserver(highlightInput).observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true
});

highlightInput();