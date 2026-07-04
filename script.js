/**
 * ============================================================
 * Personal Portfolio — script.js
 * ============================================================
 * Author      : [Your Name]
 * Description : All client-side JavaScript for the portfolio.
 *
 * Responsibilities
 * ─────────────────────────────────────────────────────────────
 * 1.  Theme Toggle (dark ↔ light, persisted in localStorage)
 * 2.  Navbar Scroll Effects (shadow + active link highlight)
 * 3.  Mobile Hamburger Menu
 * 4.  Reveal Animations (IntersectionObserver fade-in)
 * 5.  Typewriter Effect (hero role text cycling)
 * 6.  Counter Animation (stats numbers count up)
 * 7.  Skill Bar Animation (width slides in on scroll)
 * 8.  Project Filter (show/hide cards by category)
 * 9.  Contact Form (EmailJS submission + validation)
 * 10. AI Chat Widget (OpenAI via backend proxy)
 * 11. Scroll-to-top Button
 * 12. Footer year (auto-updates)
 *
 * Learning Notes
 * ─────────────────────────────────────────────────────────────
 * • We use `DOMContentLoaded` so the script runs after HTML
 *   parsing is complete (even though we have `defer` on the
 *   <script> tag — belt & suspenders).
 * • All DOM queries are cached in variables at the top of each
 *   section to avoid repeated `document.getElementById` calls.
 * • Event delegation is used where multiple similar elements
 *   share the same handler (filter buttons, suggestion chips).
 * ============================================================
 */

/* ============================================================
   CONFIGURATION — Edit these constants to personalise the site
   ============================================================ */
const CONFIG = {
  /* ── About You (fed to the AI as context) ── */
  ownerName:  "Abhijeet Kumar",
  ownerRole:  "Full Stack Engineer",
  ownerEmail: "abhijeetkumar431323@gmail.com",
  ownerPhone: "+91-6200431323",
  ownerLocation: "India",
  skills:     "React.js, Redux Toolkit, TypeScript, Node.js, Express.js, MongoDB, Firebase, Socket.IO, Redis, Tailwind CSS, Shadcn UI, Bootstrap, Git, Python",
  projects:   "The Book Store (MERN + Stripe), Streamzilla (Video Streaming)",
  experience: "Full Stack Engineer at Groove Innovations | React.js Teaching Assistant at Sunrise Mentors Pvt. Ltd.",
  education:  "B.Tech in Electrical Engineering (Ideal Institute of Engineering) | Full Stack Web Development Certification (Coding Ninjas)",
  github:     "https://github.com/abhithakur7080",
  linkedin:   "https://linkedin.com/in/abhijeet-kumar-76863217a",

  /* ── Typewriter text pool ── */
  typewriterPhrases: [
    "full stack apps.",
    "React.js UIs.",
    "scalable backends.",
    "with TypeScript.",
    "with Node.js & MongoDB.",
  ],

  /* ── EmailJS credentials ──
     Get yours at: https://www.emailjs.com/
     1. Create a free account
     2. Add a service (Gmail, Outlook, etc.)
     3. Create an email template
     4. Copy the IDs below                    */
  emailjs: {
    publicKey: "v4eyTsNACEMfeWNg5",   // From Account > API Keys
    serviceId: "service_ut7cvxe",   // From Email Services tab
    templateId: "template_y0zj2di",  // From Email Templates tab
  },

  /* ── AI Chat backend proxy URL ──
     The proxy (proxy/server.js) receives requests from this
     frontend and forwards them to OpenAI, keeping the API key
     server-side only.
     Change this to your deployed URL in production.            */
  chatProxyUrl: "http://localhost:3001/api/chat",
};

let vantaEffect = null;

/* ============================================================
   WAIT FOR DOM — ensures all elements exist before we query them
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  // Initialise each feature module in order
  initNavbar();
  initHamburger();
  initRevealAnimations();
  initTypewriter();
  initCounterAnimations();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initChatWidget();
  initScrollTopButton();
  initFooterYear();
  initVanillaTilt();
  initSmoothScroll();
  initDevJokes();
  initVantaBackground();
  initCustomCursor();

  console.log("✅ Portfolio JS loaded successfully");
});


/* ============================================================
   VANTA.JS BACKGROUND
   ============================================================ */
function initVantaBackground() {
  if (typeof VANTA !== "undefined") {
    vantaEffect = VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x3a3d5c, /* Very muted, professional colors */
      backgroundColor: 0x050816,
      points: 9.00, /* Less dense */
      maxDistance: 19.00,
      spacing: 20.00,
      showDots: true
    });
  }
}


/* ============================================================
   2. NAVBAR SCROLL EFFECTS
   ============================================================
   Adds a `.scrolled` class to the navbar once the user has
   scrolled past 20 px — CSS then applies a stronger shadow.

   Also highlights the nav link whose section is currently
   in view using IntersectionObserver on each section.
   ============================================================ */
function initNavbar() {
  const navbar   = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  /* ── Scroll shadow ── */
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true }); // `passive: true` improves scroll performance

  /* ── Active link highlight via IntersectionObserver ──
     Fires when ≥40% of a section enters the viewport. */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          /* Remove active from all links */
          navLinks.forEach((l) => l.classList.remove("active"));
          /* Add active to the matching link */
          const match = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`
          );
          if (match) match.classList.add("active");
        }
      });
    },
    { threshold: 0.4 } // 40% of section must be visible
  );

  sections.forEach((s) => observer.observe(s));
}


/* ============================================================
   3. MOBILE HAMBURGER MENU
   ============================================================
   Toggles the mobile nav dropdown by adding `.open` to both
   the hamburger button and the nav-links container.
   Closes the menu when a link is clicked.
   ============================================================ */
function initHamburger() {
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks  = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    /* Keep aria-expanded in sync for screen readers */
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  /* Close menu when any nav link is clicked */
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}


/* ============================================================
   4. REVEAL ANIMATIONS (Scroll Fade-In)
   ============================================================
   Every element with class `.reveal` starts invisible
   (opacity: 0, translateY: 30px in CSS).

   An IntersectionObserver watches them and adds `.active`
   when they enter the viewport, triggering the CSS transition.

   Why IntersectionObserver instead of scroll events?
   → Much more performant — no continuous scroll calculation.
   ============================================================ */
function initRevealAnimations() {
  /* Select all three reveal variants — base, slide-left, slide-right */
  const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          /* Unobserve after animating — no need to watch forever */
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 } // 12% visible triggers the animation
  );

  elements.forEach((el) => observer.observe(el));
}


/* ============================================================
   5. TYPEWRITER EFFECT
   ============================================================
   Cycles through CONFIG.typewriterPhrases one character at a
   time, simulating a typing + erasing animation.

   States:
   - "typing"  → add one char every `typeSpeed` ms
   - "pausing" → wait `pauseTime` ms at end of phrase
   - "erasing" → remove one char every `eraseSpeed` ms
   ============================================================ */
function initTypewriter() {
  const output = document.getElementById("typed-output");
  if (!output) return;

  const phrases    = CONFIG.typewriterPhrases;
  const typeSpeed  = 80;    // ms per character typed
  const eraseSpeed = 40;    // ms per character erased
  const pauseTime  = 2000;  // ms to show the full phrase

  let phraseIndex = 0;  // Which phrase we're on
  let charIndex   = 0;  // Which character within the phrase
  let isErasing   = false;

  /**
   * Recursively schedules itself using setTimeout.
   * Using recursion rather than setInterval gives us flexible
   * timing per state (type slow, erase faster).
   */
  function tick() {
    const phrase  = phrases[phraseIndex];
    const current = output.textContent;

    if (!isErasing) {
      /* ── Typing mode: add next character ── */
      output.textContent = phrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === phrase.length) {
        /* Phrase fully typed — pause before erasing */
        isErasing = true;
        setTimeout(tick, pauseTime);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      /* ── Erasing mode: remove last character ── */
      output.textContent = phrase.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        /* Phrase erased — move to next phrase */
        isErasing    = false;
        phraseIndex  = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 400); // Brief pause before typing next phrase
        return;
      }
      setTimeout(tick, eraseSpeed);
    }
  }

  setTimeout(tick, 1000); // Initial delay before first phrase starts
}


/* ============================================================
   6. COUNTER ANIMATIONS (Stats Numbers)
   ============================================================
   Elements with `data-target="N"` are counted up from 0 → N
   when they scroll into view.

   Uses IntersectionObserver + requestAnimationFrame for a
   smooth, 1.5-second count-up animation.
   ============================================================ */
function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number[data-target]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));

  /**
   * Animates a counter element from 0 to its data-target value.
   * Uses requestAnimationFrame for 60fps smoothness.
   *
   * @param {HTMLElement} el - The counter element
   */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1500; // ms
    const start    = performance.now();

    function update(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1); // Clamp to [0, 1]

      /* Ease-out curve: slows down as it approaches the target */
      const eased = 1 - Math.pow(1 - progress, 3);

      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update); // Keep animating
      } else {
        el.textContent = target; // Ensure exact final value
      }
    }

    requestAnimationFrame(update);
  }
}


/* ============================================================
   7. SKILL BAR ANIMATIONS
   ============================================================
   Each `.skill-bar-fill` has a `data-level` attribute (0–100).
   When the bar scrolls into view, we set its CSS width to that
   percentage value, and the CSS transition handles the animation.
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill[data-level]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          /* Set inline width → CSS transition fires */
          entry.target.style.width = entry.target.dataset.level + "%";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach((bar) => observer.observe(bar));
}


/* ============================================================
   8. PROJECT FILTER
   ============================================================
   Filter buttons have `data-filter` attributes.
   Each project card has a `data-category` attribute (space-
   separated list, e.g. "ai frontend").

   When a filter button is clicked:
   1. Mark it as `.active` (CSS highlights it)
   2. Show/hide cards whose category includes the filter value
   3. "all" filter shows everything

   CSS `.hidden` on cards uses `display: none`.
   ============================================================ */
function initProjectFilter() {
  const filterBtns  = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter; // e.g. "ai", "frontend", "all"

      /* Update active button */
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      /* Show/hide cards */
      projectCards.forEach((card) => {
        const categories = card.dataset.category || ""; // "ai frontend"

        if (filter === "all" || categories.includes(filter)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}


/* ============================================================
   9. CONTACT FORM (EmailJS)
   ============================================================
   On submit:
   1. Validate all required fields (name, email, message)
   2. Show loading state on button
   3. Call emailjs.sendForm() with the IDs from CONFIG
   4. Show success or error feedback
   5. Reset form on success

   NOTE: EmailJS must be loaded from the CDN (see index.html)
   before this script runs. The `defer` attribute ensures that.
   ============================================================ */
function initContactForm() {
  const form       = document.getElementById("contact-form");
  const submitBtn  = document.getElementById("contact-submit");
  const statusMsg  = document.getElementById("form-status");

  if (!form) return;

  /* Initialise EmailJS with your public key */
  if (window.emailjs) {
    emailjs.init(CONFIG.emailjs.publicKey);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default browser form submission

    /* ── Validation ── */
    if (!validateForm(form)) return;

    /* ── Show loading state ── */
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    statusMsg.textContent = "";
    statusMsg.className   = "form-status";

    try {
      /* ── Send via EmailJS ── */
      await emailjs.sendForm(
        CONFIG.emailjs.serviceId,
        CONFIG.emailjs.templateId,
        form
      );

      /* ── Success ── */
      statusMsg.textContent = "✅ Message sent! I'll get back to you soon.";
      statusMsg.className   = "form-status success";
      form.reset(); // Clear all fields

    } catch (err) {
      /* ── Error ── */
      console.error("EmailJS error:", err);
      statusMsg.textContent = "❌ Something went wrong. Please email me directly.";
      statusMsg.className   = "form-status error";
    } finally {
      /* ── Always restore button ── */
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });

  /**
   * Validates all required inputs in the form.
   * Shows inline error messages for each invalid field.
   *
   * @param {HTMLFormElement} form
   * @returns {boolean} true if all fields are valid
   */
  function validateForm(form) {
    let isValid = true;

    /* Clear previous errors */
    form.querySelectorAll(".form-error").forEach((el) => {
      el.textContent = "";
    });

    /* Check each required field */
    form.querySelectorAll("[required]").forEach((field) => {
      const error = field.nextElementSibling; // The <span class="form-error">
      const value = field.value.trim();

      if (!value) {
        showError(error, "This field is required.");
        isValid = false;
        return;
      }

      /* Extra email format check */
      if (field.type === "email" && !isValidEmail(value)) {
        showError(error, "Please enter a valid email address.");
        isValid = false;
      }
    });

    return isValid;
  }

  /** Shows an error message and adds a shake animation to the field */
  function showError(errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    const field = errorEl.previousElementSibling;
    field.style.animation = "none"; // Reset
    void field.offsetWidth;          // Reflow trick to restart animation
    field.style.animation = "shake 0.3s ease";
  }

  /** Basic email regex check */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


/* ============================================================
   10. AI CHAT WIDGET
   ============================================================
   Architecture:
   ┌─────────────┐   POST /api/chat   ┌──────────────┐
   │  This JS    │ ──────────────────► │ proxy/server │
   │ (frontend)  │ ◄────────────────── │   .js (Node) │
   └─────────────┘   streamed reply   └──────┬───────┘
                                              │ OpenAI API
                                              ▼
                                        GPT-4o response

   Why a proxy?
   → Putting the OpenAI key directly in frontend JS exposes it
     to anyone who views source. The proxy keeps it server-side.

   Features:
   - Welcome message on first open
   - Quick-question suggestion chips
   - Streaming responses (word-by-word via ReadableStream)
   - Chat history in localStorage (survives page reload)
   - Copy button on each bot message
   - Clear history button
   ============================================================ */
function initChatWidget() {
  /* ── DOM References ── */
  const toggleBtn   = document.getElementById("chat-toggle-btn");
  const panel       = document.getElementById("chat-panel");
  const messagesDiv = document.getElementById("chat-messages");
  const input       = document.getElementById("chat-input");
  const sendBtn     = document.getElementById("chat-send-btn");
  const clearBtn    = document.getElementById("chat-clear-btn");
  const suggestions = document.getElementById("chat-suggestions");

  if (!toggleBtn || !panel) return;

  /* ── State ── */
  let isOpen     = false;  // Is the chat panel visible?
  let isLoading  = false;  // Is the AI currently responding?

  /**
   * Chat history array — each message is:
   * { role: "user" | "assistant", content: "..." }
   *
   * This is sent to the proxy on every request so the AI has
   * context from the full conversation.
   */
  let chatHistory = [];

  /* ── System Prompt ──
     Tells the AI who it's representing and how to behave.
     Personalise this with real details about yourself!      */
  const SYSTEM_PROMPT = `You are a friendly AI assistant embedded in ${CONFIG.ownerName}'s personal portfolio website.

Your job is to help visitors learn about ${CONFIG.ownerName}.

Key facts about ${CONFIG.ownerName}:
• Role: ${CONFIG.ownerRole}
• Location: ${CONFIG.ownerLocation}
• Skills: ${CONFIG.skills}
• Projects: ${CONFIG.projects}
• Experience: ${CONFIG.experience}
• Education: ${CONFIG.education}
• Email: ${CONFIG.ownerEmail}
• Phone: ${CONFIG.ownerPhone}
• GitHub: ${CONFIG.github}
• LinkedIn: ${CONFIG.linkedin}

Guidelines:
- Be warm, concise, and helpful
- Answer questions about skills, projects, background, and how to contact
- If asked something unrelated to the portfolio, politely redirect
- Keep responses under 150 words unless more detail is specifically asked for
- Use simple, friendly language — no jargon`;

  /* ── Restore history from localStorage ── */
  loadHistory();

  /* ══════════════════════════════════════════════════
     PANEL OPEN / CLOSE
     ══════════════════════════════════════════════════ */
  toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.hidden = !isOpen;
    toggleBtn.classList.toggle("open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-label", isOpen ? "Close AI chat" : "Open AI chat");

    if (isOpen) {
      /* Show welcome message only on very first open */
      if (chatHistory.length === 0) {
        appendMessage("bot", `👋 Hi! I'm ${CONFIG.ownerName}'s AI assistant. Ask me anything about their skills, projects, or how to get in touch!`);
      }
      /* Focus the input when panel opens — accessibility */
      setTimeout(() => input.focus(), 300);
      scrollToBottom();
    }
  });

  /* Close chat panel when clicking outside */
  document.addEventListener("click", (e) => {
    if (isOpen && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
      isOpen = false;
      panel.hidden = true;
      toggleBtn.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "Open AI chat");
    }
  });

  /* ══════════════════════════════════════════════════
     SEND MESSAGE — multiple triggers
     ══════════════════════════════════════════════════ */

  /* Send on button click */
  sendBtn.addEventListener("click", handleSend);

  /* Send on Enter key (Shift+Enter = new line) */
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  /* Enable/disable send button based on input content */
  input.addEventListener("input", () => {
    sendBtn.disabled = input.value.trim() === "";
    /* Auto-grow the textarea height */
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  });

  /* Suggestion chips send their text directly */
  suggestions.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const question = chip.dataset.question;
      input.value = question;
      sendBtn.disabled = false;
      handleSend();
      /* Hide suggestion chips after first use */
      suggestions.style.display = "none";
    });
  });

  /* ══════════════════════════════════════════════════
     CLEAR HISTORY
     ══════════════════════════════════════════════════ */
  clearBtn.addEventListener("click", () => {
    chatHistory = [];
    messagesDiv.innerHTML = "";
    localStorage.removeItem("portfolio-chat-history");
    suggestions.style.display = "flex"; // Show chips again
    appendMessage("bot", "Chat cleared! How can I help you?");
  });

  /* ══════════════════════════════════════════════════
     HANDLE SEND — the main message flow
     ══════════════════════════════════════════════════ */
  async function handleSend() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    /* Reset input */
    input.value = "";
    input.style.height = "auto";
    sendBtn.disabled = true;

    /* Display user's message */
    appendMessage("user", text);
    scrollToBottom();

    /* Add to history for context */
    chatHistory.push({ role: "user", content: text });

    /* Show typing indicator */
    const typingId = appendTypingIndicator();
    isLoading = true;

    try {
      /* Simulate realistic network delay (1.5 to 3 seconds) */
      const delay = 1500 + Math.random() * 1500;
      await new Promise(r => setTimeout(r, delay));

      /* Remove typing indicator */
      removeTypingIndicator(typingId);

      /* Generate local response based on keywords */
      const botText = generateLocalResponse(text.toLowerCase());

      /* Save completed response to history */
      chatHistory.push({ role: "assistant", content: botText });
      saveHistory();

      /* Stream the response with a realistic typewriter effect */
      await simulateTypewriterResponse(botText);

    } catch (err) {
      removeTypingIndicator(typingId);
      console.error("Chat error:", err);
      appendMessage("bot", "Sorry, something went wrong processing your message.");
      chatHistory.pop();
    } finally {
      isLoading = false;
      scrollToBottom();
    }
  }

  /* ══════════════════════════════════════════════════
     LOCAL RESPONSE GENERATOR
     ══════════════════════════════════════════════════ */
  function generateLocalResponse(msg) {
    if (msg.includes("skill") || msg.includes("tech") || msg.includes("stack") || msg.includes("know")) {
      return "<i class='fa-solid fa-code' style='color: var(--color-accent); font-size: 1.1em;'></i> <strong>Core Stack:</strong> JavaScript, TypeScript, React, Node.js, and MongoDB.\n\n<i class='fa-solid fa-layer-group' style='color: var(--color-accent); font-size: 1.1em;'></i> <strong>Modern Tools:</strong> TailwindCSS, Vite, Vercel, Docker, and Python.\n\nAbhijeet specializes in building highly scalable, modern web applications!";
    }
    if (msg.includes("project") || msg.includes("work") || msg.includes("built") || msg.includes("portfolio")) {
      return "<i class='fa-solid fa-rocket' style='color: var(--color-accent); font-size: 1.1em;'></i> Abhijeet has delivered several premium full-stack projects!\n\n<i class='fa-solid fa-cart-shopping' style='color: var(--color-accent); font-size: 1.1em;'></i> <strong>The Book Store:</strong> A comprehensive MERN e-commerce platform with Stripe integration.\n<i class='fa-solid fa-video' style='color: var(--color-accent); font-size: 1.1em;'></i> <strong>Streamzilla:</strong> A state-of-the-art streaming UI clone.\n\nPlease check the 'Projects' section above for live demos and source code.";
    }
    if (msg.includes("experience") || msg.includes("job") || msg.includes("role") || msg.includes("background")) {
      return "<i class='fa-solid fa-briefcase' style='color: var(--color-accent); font-size: 1.1em;'></i> With roughly 2+ years of professional experience, Abhijeet is an established Full Stack Web Developer. He has a proven track record of engineering responsive architectures and streamlining CI/CD deployment pipelines.";
    }
    if (msg.includes("contact") || msg.includes("email") || msg.includes("hire") || msg.includes("reach") || msg.includes("message")) {
      return "<i class='fa-solid fa-envelope' style='color: var(--color-accent); font-size: 1.1em;'></i> We would love to hear from you!\n\nYou can reach out directly via the Contact Form at the bottom of this page, or connect with Abhijeet via LinkedIn or Email. He is currently open to new opportunities.";
    }
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("greet")) {
      return "<i class='fa-solid fa-hand-sparkles' style='color: var(--color-accent); font-size: 1.1em;'></i> Hello! I am the automated assistant for Abhijeet Kumar.\n\nHow may I assist you today? Feel free to ask me about his technical skills, professional experience, or portfolio projects.";
    }
    if (msg.includes("who") || msg.includes("name") || msg.includes("you")) {
      return "<i class='fa-solid fa-robot' style='color: var(--color-accent); font-size: 1.1em;'></i> I am a local AI assistant embedded directly within this portfolio. My purpose is to help you seamlessly explore Abhijeet Kumar's professional background and capabilities.";
    }
    if (msg.includes("resume") || msg.includes("cv")) {
      return "<i class='fa-solid fa-file-pdf' style='color: var(--color-accent); font-size: 1.1em;'></i> <strong>Resume Available:</strong>\n\nYou can securely download Abhijeet's complete and up-to-date resume by clicking the designated 'Download Resume' button located in the Hero section at the top of the page.";
    }
    if (msg.includes("joke") || msg.includes("funny") || msg.includes("laugh")) {
      const jokes = [
        "Why do programmers prefer dark mode?\n\nBecause light attracts bugs.",
        "How many programmers does it take to change a light bulb?\n\nNone, that's a hardware problem.",
        "Why did the programmer quit his job?\n\nBecause he didn't get arrays.",
        "What's a programmer's favorite hangout place?\n\nFoo Bar.",
        "A SQL query goes into a bar, walks up to two tables and asks...\n\n'Can I join you?'",
        "I've got a really good UDP joke to tell you...\n\nbut I don't know if you'll get it.",
        "Why do Java programmers have to wear glasses?\n\nBecause they don't C#."
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      return `<i class='fa-solid fa-face-laugh-squint' style='color: var(--color-accent); font-size: 1.1em;'></i> Here's a dev joke for you:\n\n${randomJoke}`;
    }
    // Default fallback
    return "<i class='fa-regular fa-lightbulb' style='color: var(--color-accent); font-size: 1.1em;'></i> That is an excellent inquiry! While my current local dataset is streamlined, you can find comprehensive details throughout the sections above.\n\nFor specific questions, please feel free to use the contact form to reach Abhijeet directly.";
  }

  /* ══════════════════════════════════════════════════
     TYPEWRITER RESPONSE SIMULATOR
     ══════════════════════════════════════════════════ */
  async function simulateTypewriterResponse(text) {
    const { bubble } = appendMessage("bot", "");
    bubble.innerHTML = ""; // Prepare for HTML injection
    
    let currentHtml = "";
    let isTag = false;
    let tagBuffer = "";
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char === '<') {
        isTag = true;
      }
      
      if (isTag) {
        tagBuffer += char;
        if (char === '>') {
          isTag = false;
          currentHtml += tagBuffer;
          tagBuffer = "";
          bubble.innerHTML = currentHtml;
        }
      } else {
        currentHtml += char;
        bubble.innerHTML = currentHtml;
        scrollToBottom();
        // Fast typing speed: 10-25ms per character
        await new Promise(r => setTimeout(r, 10 + Math.random() * 15));
      }
    }
    
    addCopyButton(bubble.parentElement, text);
    return text;
  }

  /* ══════════════════════════════════════════════════
     DOM HELPERS
     ══════════════════════════════════════════════════ */

  /**
   * Appends a message bubble to the chat log.
   * Returns references so callers can update them (streaming).
   *
   * @param {"bot"|"user"} role
   * @param {string} text
   * @returns {{ wrapper: HTMLElement, bubble: HTMLElement }}
   */
  function appendMessage(role, text) {
    const wrapper = document.createElement("div");
    wrapper.className = `message ${role === "bot" ? "bot-message" : "user-message"}`;

    const avatar = document.createElement("div");
    avatar.className   = "message-avatar";
    // Replace emojis with FontAwesome icons
    avatar.innerHTML = role === "bot" 
      ? "<i class='fa-solid fa-robot' style='color: var(--color-accent);'></i>" 
      : "<i class='fa-solid fa-user' style='color: #fff;'></i>";
    avatar.setAttribute("aria-hidden", "true");

    const bubble = document.createElement("div");
    bubble.className   = "message-bubble";
    
    if (role === "bot") {
      bubble.innerHTML = text; // Allow HTML rendering for icons
    } else {
      bubble.textContent = text; // Prevent XSS for user input
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    messagesDiv.appendChild(wrapper);

    return { wrapper, bubble };
  }

  /**
   * Appends a "typing..." indicator (three bouncing dots).
   * Returns a unique ID so it can be removed later.
   *
   * @returns {string} The ID to pass to removeTypingIndicator()
   */
  function appendTypingIndicator() {
    const id = "typing-" + Date.now();

    const wrapper = document.createElement("div");
    wrapper.className = "message bot-message typing-indicator";
    wrapper.id = id;

    const avatar = document.createElement("div");
    avatar.className   = "message-avatar";
    avatar.textContent = "🤖";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.innerHTML = `
      <span class="dot" aria-hidden="true"></span>
      <span class="dot" aria-hidden="true"></span>
      <span class="dot" aria-hidden="true"></span>
    `;
    bubble.setAttribute("aria-label", "AI is typing...");

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    messagesDiv.appendChild(wrapper);
    scrollToBottom();

    return id;
  }

  /** Removes the typing indicator by its ID */
  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  /**
   * Adds a "Copy" button to a bot message after it finishes.
   * Copies the text to clipboard and briefly shows "Copied!".
   *
   * @param {HTMLElement} wrapper - The message wrapper div
   * @param {string} text - The full text to copy
   */
  function addCopyButton(wrapper, text) {
    const copyBtn = document.createElement("button");
    copyBtn.className   = "copy-btn";
    copyBtn.textContent = "📋 Copy";
    copyBtn.setAttribute("aria-label", "Copy AI response to clipboard");

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => { copyBtn.textContent = "📋 Copy"; }, 2000);
      } catch {
        copyBtn.textContent = "❌ Failed";
      }
    });

    wrapper.appendChild(copyBtn);
  }

  /** Scrolls the message list to the bottom */
  function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  /* ══════════════════════════════════════════════════
     LOCAL STORAGE — Persist chat across page reloads
     ══════════════════════════════════════════════════ */

  /** Save current chatHistory array to localStorage */
  function saveHistory() {
    try {
      localStorage.setItem(
        "portfolio-chat-history",
        JSON.stringify(chatHistory)
      );
    } catch {
      /* localStorage might be full or disabled — fail silently */
    }
  }

  /**
   * Load saved history from localStorage and render existing
   * messages so the conversation appears when returning to the page.
   */
  function loadHistory() {
    try {
      const saved = localStorage.getItem("portfolio-chat-history");
      if (!saved) return;

      chatHistory = JSON.parse(saved);

      /* Re-render each stored message */
      chatHistory.forEach(({ role, content }) => {
        const domRole = role === "assistant" ? "bot" : "user";
        appendMessage(domRole, content);
      });

      /* Hide suggestions if there's existing conversation */
      if (chatHistory.length > 0) {
        suggestions.style.display = "none";
      }
    } catch {
      /* Corrupted data — start fresh */
      chatHistory = [];
    }
  }
}


/* ============================================================
   11. SCROLL-TO-TOP BUTTON
   ============================================================
   Shows the button after scrolling 400 px down.
   Clicking it smooth-scrolls back to the top.
   ============================================================ */
function initScrollTopButton() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  /* Show/hide based on scroll position */
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  /* Scroll to top on click */
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* ============================================================
   12. FOOTER YEAR
   ============================================================
   Automatically inserts the current year so you never need to
   manually update it.
   ============================================================ */
function initFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ============================================================
   13. VANILLA TILT 3D EFFECTS
   ============================================================
   Adds a 3D tilt effect to specified cards on mouse hover.
   ============================================================ */
function initVanillaTilt() {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.project-card, .skill-category, .about-photo, .hero-code-card'), {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      perspective: 1000
    });
  }
}

/* ============================================================
   14. DEV JOKES LOGIC
   ============================================================ */
function initDevJokes() {
  const newJokeBtn = document.getElementById("new-joke-btn");
  const jokeText = document.getElementById("joke-text");
  
  if (!newJokeBtn || !jokeText) return;
  
  const jokes = [
    "Why do programmers prefer dark mode?<br><br>Because light attracts bugs.",
    "How many programmers does it take to change a light bulb?<br><br>None, that's a hardware problem.",
    "Why did the programmer quit his job?<br><br>Because he didn't get arrays.",
    "What's a programmer's favorite hangout place?<br><br>Foo Bar.",
    "A SQL query goes into a bar, walks up to two tables and asks...<br><br>'Can I join you?'",
    "I've got a really good UDP joke to tell you...<br><br>but I don't know if you'll get it.",
    "Why do Java programmers have to wear glasses?<br><br>Because they don't C#."
  ];
  
  newJokeBtn.addEventListener("click", () => {
    // Add small animation for smooth transition
    jokeText.style.opacity = 0;
    
    setTimeout(() => {
      let randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      // Ensure we don't pick the same joke twice in a row
      while (randomJoke === jokeText.innerHTML) {
        randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      }
      jokeText.innerHTML = randomJoke;
      jokeText.style.opacity = 1;
    }, 200);
  });
  
  jokeText.style.transition = "opacity 0.2s ease";
}

/* ============================================================
   15. SMOOTH SCROLL FOR NAV LINKS
   ============================================================
   Ensures all anchor links smoothly scroll to their target sections,
   even on browsers where CSS scroll-behavior fails.
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Get dynamic navbar height (fallback to 70px if missing)
        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 70;
        
        // Calculate precise scroll position
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================================
   15. CUSTOM ANIMATED CURSOR
   ============================================================ */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  // Hide until first move
  cursor.style.opacity = 0;
  let hasMoved = false;
  
  document.addEventListener('mousemove', (e) => {
    if (!hasMoved) {
      cursor.style.opacity = 1;
      hasMoved = true;
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Use requestAnimationFrame + translate3d for buttery-smooth hardware acceleration
  const updateCursor = () => {
    // The -1 offsets align the visual tip of the glowing SVG perfectly with the real mouse hit-target
    cursor.style.transform = `translate3d(${mouseX - 1}px, ${mouseY - 1}px, 0)`;
    requestAnimationFrame(updateCursor);
  };
  requestAnimationFrame(updateCursor);
  
  // Add hover effects for interactive elements
  const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-bar-item, .contact-card, .theme-toggle, .hamburger, .card-link-btn, .filter-btn');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
}
