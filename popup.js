const templates = {
  research: `Give a quick overview of [TOPIC] by following this structure (be concise):

1. FOUNDATIONAL KNOWLEDGE
- What are the core principles/historical roots of [TOPIC]?
- Key terminology, influential figures, and pivotal moments
- Why does this matter? What problem does it solve or curiosity does it fulfill?

2. KEY COMPONENTS & SYSTEMS
- Break [TOPIC] into its critical parts (tools, processes, theories, stakeholders)
- How do these parts interact? What's the hierarchy/ecosystem?

3. PRACTICAL APPLICATIONS
- How is [TOPIC] used in the real world? Share surprising/niche use cases
- What skills, tools, or resources are needed to engage with it?

4. CULTURAL/SOCIAL IMPACT
- How has [TOPIC] shaped societies, behaviors, or beliefs?
- Controversies, myths, or ethical debates surrounding it

5. EXPERTS' SECRETS
- What do seasoned practitioners wish beginners knew?
- Common misconceptions or overlooked nuances

6. FUTURE TRENDS
- Emerging innovations, predicted shifts, or unresolved questions in [TOPIC]

7. COMPARATIVE LENS
- How does [TOPIC] differ across cultures, industries, or time periods?
- Analogies to simplify complex aspects (e.g., "X is like Y because...")

8. STARTER TOOLKIT
- Recommend 1-2 essential books/documentaries/podcasts/tools
- Forums/communities where experts gather`
};

document.getElementById('insertBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Get topic
  const topic = prompt('Enter your research topic:');
  if (!topic) return;

  // Generate template
  const template = templates.research.replace(/\[TOPIC\]/g, topic);

  // Universal insertion
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (templateText) => {
      // Current 2024 Selectors
      const selectors = [
        // ChatGPT
        '#prompt-textarea',
        // Claude
        '.ProseMirror',
        // Perplexity
        'textarea[placeholder="Ask anything..."]',
        // DeepSeek
        '.chat-input textarea',
        // Fallbacks
        'textarea',
        '[contenteditable="true"]'
      ];

      const inputField = selectors.reduce((found, selector) =>
        found || document.querySelector(selector), null);

      if (!inputField) {
        alert('First click in the chat input field!');
        return;
      }

      // Universal insertion method
      const insertText = (text) => {
        if (inputField.tagName === 'TEXTAREA') {
          inputField.value = text;
        } else {
          inputField.textContent = text;
        }

        // Trigger all necessary events
        ['input', 'change', 'keydown', 'keyup'].forEach(eventType => {
          inputField.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
      };

      // Execute
      inputField.focus();
      setTimeout(() => {
        insertText(templateText);
        inputField.scrollIntoView();
      }, 100);
    },
    args: [template]
  });
});