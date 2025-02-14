const templates = {
  research: `Get a quick overview of [TOPIC] by following this structure (be concise):

1. Foundational Knowledge
- What are the core principles/historical roots of [TOPIC]?
- Key terminology, influential figures, pivotal moments
- Why does this matter? What problem does it solve?

2. Key Components & Systems
- Critical parts (tools, processes, theories, stakeholders)
- How do these parts interact? Hierarchy/ecosystem?

3. Practical Applications
- Real-world/niche use cases
- Required skills/tools/resources

4. Cultural/Social Impact
- Societal influence and ethical debates
- Controversies and myths

5. Experts' Insights
- What professionals wish beginners knew
- Common misconceptions

6. Future Trends
- Emerging innovations and unanswered questions

7. Comparative Analysis
- Differences across cultures/industries/time
- Simplifying analogies

8. Starter Resources
- Essential books/tools/communities`
};

const insertBtn = document.getElementById('insertBtn');
const loader = document.querySelector('.loader');
const statusMessage = document.getElementById('statusMessage');

document.getElementById('insertBtn').addEventListener('click', async () => {
  insertBtn.disabled = true;
  loader.style.display = 'block';
  insertBtn.querySelector('span').textContent = 'Inserting...';
  statusMessage.style.display = 'none';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const topic = prompt('Enter your research topic:');

    if (!topic) {
      statusMessage.textContent = '🚫 Cancelled by user';
      statusMessage.style.color = '#6b7280';
      statusMessage.style.display = 'block';
      return;
    }

    const template = templates.research.replace(/\[TOPIC\]/g, topic);

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (templateText) => {
        const selectors = [
          '#prompt-textarea',
          '.ProseMirror',
          'textarea[placeholder="Ask anything..."]',
          '.chat-input textarea',
          'textarea',
          '[contenteditable="true"]'
        ];

        const inputField = selectors.reduce((found, selector) =>
          found || document.querySelector(selector), null);

        if (!inputField) {
          alert('❗ First click in the chat input field!');
          return;
        }

        const insertText = (text) => {
          if (inputField.tagName === 'TEXTAREA') {
            inputField.value = text;
          } else {
            inputField.textContent = text;
          }

          ['input', 'change', 'keydown', 'keyup'].forEach(eventType => {
            inputField.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
        };

        inputField.focus();
        setTimeout(() => {
          insertText(templateText);
          inputField.scrollIntoView();
        }, 100);
      },
      args: [template]
    });

    statusMessage.textContent = '✅ Template inserted successfully!';
    statusMessage.style.color = '#10a37f';
    statusMessage.style.display = 'block';

  } catch (error) {
    console.error('Extension Error:', error);
    statusMessage.textContent = '❌ Failed to insert template';
    statusMessage.style.color = '#ef4444';
    statusMessage.style.display = 'block';

  } finally {
    insertBtn.disabled = false;
    loader.style.display = 'none';
    insertBtn.querySelector('span').textContent = 'Insert Template';
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 3000);
  }
});