const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const statusEl = document.getElementById("status");

let apiKey = "";
let conversationHistory = [
  {
    role: "system",
    content:
      "You are a helpful, friendly AI assistant. Keep responses concise and clear.",
  },
];

// --- Settings ---
settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("open");
});

saveKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key) return;

  apiKey = key;
  messageInput.disabled = false;
  sendBtn.disabled = false;
  statusEl.textContent = "Online";
  statusEl.classList.add("online");
  settingsPanel.classList.remove("open");

  // Clear welcome message
  const welcome = chatMessages.querySelector(".welcome-message");
  if (welcome) welcome.remove();

  addMessage("bot", "API key saved! How can I help you today?");
});

// --- Auto-resize textarea ---
messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = messageInput.scrollHeight + "px";
});

// Submit on Enter (Shift+Enter for new line)
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event("submit"));
  }
});

// --- Send Message ---
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text || !apiKey) return;

  addMessage("user", text);
  messageInput.value = "";
  messageInput.style.height = "auto";

  conversationHistory.push({ role: "user", content: text });

  sendBtn.disabled = true;
  messageInput.disabled = true;

  const typingEl = showTypingIndicator();

  try {
    const reply = await fetchAIResponse();
    typingEl.remove();
    addMessage("bot", reply);
    conversationHistory.push({ role: "assistant", content: reply });
  } catch (err) {
    typingEl.remove();
    addMessage("error", err.message);
  } finally {
    sendBtn.disabled = false;
    messageInput.disabled = false;
    messageInput.focus();
  }
});

// --- API Call ---
async function fetchAIResponse() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: conversationHistory,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const msg =
      errorData?.error?.message || `API error: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// --- UI Helpers ---
function addMessage(type, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;

  const avatarLabel = type === "user" ? "You" : "AI";
  const avatarDiv = document.createElement("div");
  avatarDiv.className = "message-avatar";
  avatarDiv.textContent = avatarLabel;

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  contentDiv.textContent = text;

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(contentDiv);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message bot";

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "message-avatar";
  avatarDiv.textContent = "AI";

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  contentDiv.innerHTML =
    '<div class="typing-indicator"><span></span><span></span><span></span></div>';

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(contentDiv);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return msgDiv;
}
