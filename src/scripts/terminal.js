export class Terminal {
  constructor() {
    this.body = document.getElementById('terminal-body');
    this.input = document.getElementById('terminal-input');
    this.display = document.getElementById('terminal-input-display');
    if (!this.body || !this.input) return;

    this.prompt = `<span class="terminal-prompt"><span class="term-indigo">guest</span><span class="term-gray">@dev</span> <span class="term-gray">~</span> <span class="term-yellow">❯</span></span>`;
    this.commands = this.buildCommands();
    this.easterEggs = this.buildEasterEggs();
    this.isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
    this.isMobile = () => window.innerWidth <= 900;
    this.isSmallScreen = () => window.innerWidth <= 480;

    // Advanced shell state
    this.history = this.loadHistory();
    this.historyIndex = -1;
    this.tempInput = "";

    // Reverse search state
    this.reverseSearchMode = false;
    this.reverseSearchMatch = "";
    this.reverseSearchHistoryIndex = -1;

    // Interaction & autoplay state
    this.hasInteracted = false;
    this.autoPlayTimeout = null;
    this.idleTimeout = null;

    // Tmux-style status bar elements
    this.statusbarMode = document.getElementById('statusbar-mode');

    this.bindEvents();
    this.autoRunHelp();
  }

  loadHistory() {
    try {
      return JSON.parse(localStorage.getItem('ms-terminal-history') || '["help", "about", "skills", "whoami"]');
    } catch (_) {
      return ["help", "about", "skills", "whoami"];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('ms-terminal-history', JSON.stringify(this.history));
    } catch (_) {}
  }

  buildCommands() {
    return {
      help: () => `
<span class="term-indigo">Available commands</span>
<span class="term-gray">──────────────────</span>
  <span class="term-yellow">about</span>      Professional summary
  <span class="term-yellow">skills</span>     Technologies &amp; frameworks
  <span class="term-yellow">projects</span>   Selected builds overview
  <span class="term-yellow">whoami</span>     Bio &amp; ASCII portrait
  <span class="term-yellow">avatar</span>     Interactive cyber stencil portrait
  <span class="term-yellow">socials</span>    GitHub &amp; LinkedIn links
  <span class="term-yellow">contact</span>    Email &amp; contact info
  <span class="term-yellow">resume</span>     Open resume / CV
  <span class="term-yellow">clear</span>      Clear terminal`,

      about: () => `
<span class="term-indigo">Mathews Shaji — Backend-Leaning Full-Stack Developer</span>
<span class="term-gray">──────────────────────────────────────────────────</span>
Specialised in Python/FastAPI backends, Go systems replication,
and multi-tenant architectures across AWS, GCP, and Azure.
Deep experience in modular data ingestion pipelines and modern
React/Next.js frontend engineering.`,

      skills: () => `
<span class="term-indigo">Technical Stacks</span>
<span class="term-gray">────────────────</span>
<span class="term-yellow">Backend:   </span>Python (FastAPI, Flask, Django), Go (Gin, SQLX), Node.js
<span class="term-yellow">Cloud:     </span>AWS (ECS, SQS, Cognito, OpenSearch), GCP (BigQuery, GKE), Azure
<span class="term-yellow">Databases: </span>PostgreSQL, MySQL, OpenSearch, Redis, MongoDB
<span class="term-yellow">Frontend:  </span>Next.js 14/15/16, React, Tailwind, shadcn/ui, Framer Motion
<span class="term-yellow">Auth:      </span>OAuth2, OIDC, JWT, AWS Cognito, Keycloak, Multi-tenant RBAC
<span class="term-yellow">AI/ML:     </span>OpenAI SDK, Amazon Bedrock, TensorFlow/Keras, OpenCV`,

      projects: () => `
<span class="term-indigo">Key Projects</span>
<span class="term-gray">────────────</span>
1. <span class="term-yellow">CloudPositive Cost Governance</span> — Multi-cloud cost SaaS, per-tenant MySQL schema
2. <span class="term-yellow">Xmigrate eBPF Replicator</span>    — Live VM disk replication via eBPF in Go
3. <span class="term-yellow">WMS &amp; Auto-Compliance</span>       — Warehouse tracker, timezone-aware cron logger
4. <span class="term-yellow">Emirati Sign Language CDA</span>   — Dubai Govt. Guinness Record signing portal
5. <span class="term-yellow">AI Medicine Bot</span>             — Serverless Durable Lambda + Bedrock prescription parser`,

      socials: () => `
<span class="term-indigo">Connect</span>
<span class="term-gray">───────</span>
<span class="term-yellow">GitHub:   </span><a href="https://github.com/DrUnkeN-SoUL" target="_blank" style="color:var(--hi)">github.com/DrUnkeN-SoUL</a>
<span class="term-yellow">LinkedIn: </span><a href="https://linkedin.com/in/mathews-shaji" target="_blank" style="color:var(--hi)">linkedin.com/in/mathews-shaji</a>`,

      contact: () => `
<span class="term-indigo">Contact</span>
<span class="term-gray">───────</span>
<span class="term-yellow">Email:    </span>mathewsshaji@gmail.com
<span class="term-yellow">LinkedIn: </span><a href="https://linkedin.com/in/mathews-shaji" target="_blank" style="color:var(--hi)">linkedin.com/in/mathews-shaji</a>
<span class="term-yellow">Location: </span>Kochi, Kerala, India
<span class="term-gray">Open to contracts &amp; full-time roles worldwide.</span>`,

      email: () => this.commands.contact(),

      resume: () => `
<span class="term-indigo">Mathews Shaji — Resume</span>
<span class="term-gray">╔══════════════════════════════════════════════════════════╗
║  mathewsshaji@gmail.com  │  github.com/DrUnkeN-SoUL  ║
║  Kochi, Kerala, India    │  linkedin.com/in/mathews-shaji ║
║  IST (UTC+5:30)          │  Open: Remote · Contract       ║
╚══════════════════════════════════════════════════════════╝</span>

<span class="term-yellow">── Experience ──────────────────────────────────────────────</span>

<span class="term-indigo">Contract Full-Stack Developer</span>    <span class="term-gray">2024 – Present</span>
<span class="term-gray">Exotic Green · Austria</span>
  ▸ FastAPI + Next.js warehouse platform (sole developer)
  ▸ APScheduler compliance cron, Cognito OAuth, Docker
  ▸ v2 rewrite: Next.js 16, Vitest, Playwright, Web Vitals

<span class="term-indigo">Backend Engineer</span>                  <span class="term-gray">Nov 2023 – Present</span>
<span class="term-gray">CloudPositive · Pre-Launch Startup</span>
  ▸ Multi-tenant FastAPI backend, per-tenant MySQL isolation
  ▸ 20+ cloud cost ingestion pipelines (AWS/GCP/Azure)
  ▸ AI cost estimation with GPT-4o-mini
  ▸ Microservices on ECS, Terraform, K8s, Helm

<span class="term-indigo">Full-Stack Developer</span>              <span class="term-gray">Jun 2023 – Nov 2023</span>
<span class="term-gray">Xmigrate</span>
  ▸ FastAPI (27+ modules), Keycloak SSO, React Flow
  ▸ Next.js 14 dashboard, Radix UI, Cloudflare

<span class="term-indigo">Web Developer Intern</span>              <span class="term-gray">May 2023 – Jun 2023</span>
<span class="term-gray">Xmigrate</span>
  ▸ REST endpoints, relational data models, integration testing

<span class="term-yellow">── Tech Stack ──────────────────────────────────────────────</span>

<span class="term-gray">Backend:</span>  Python (FastAPI, Flask, Django) · Go (Gin) · Node.js
<span class="term-gray">Cloud:</span>     AWS (ECS, SQS, Cognito, Lambda, OpenSearch)
<span class="term-gray">           </span>GCP (BigQuery, GKE) · Azure (ARM, AD App Reg)
<span class="term-gray">IaC:</span>       Terraform · Terragrunt · Kubernetes · Helm · Ansible
<span class="term-gray">DB:</span>        PostgreSQL · MySQL · OpenSearch · Redis · MongoDB
<span class="term-gray">Frontend:</span>  Next.js 14/15/16 · React · Tailwind · shadcn/ui
<span class="term-gray">Auth:</span>      OAuth2/OIDC · AWS Cognito · Keycloak · RBAC
<span class="term-gray">AI/ML:</span>     OpenAI SDK · Bedrock · TensorFlow/Keras · OpenCV

<span class="term-yellow">── Key Projects ────────────────────────────────────────────</span>

<span class="term-gray">CloudPositive</span>  — Multi-cloud cost governance SaaS
<span class="term-gray">Xmigrate</span>       — eBPF-based live VM migration replicator
<span class="term-gray">WMS</span>             — Warehouse mgmt + auto-compliance platform
<span class="term-gray">CDA</span>             — Dubai Govt. Emirati Sign Language portal
<span class="term-gray">Medicine Bot</span>   — Serverless Durable Lambda + Bedrock AI

<span class="term-gray">────────────────────────────────────────────────────────────</span>
<span class="term-gray">Type </span><span class="term-yellow">contact</span><span class="term-gray"> to reach out · </span><span class="term-yellow">about</span><span class="term-gray"> for summary</span>`,

      whoami: () => this.renderAvatar(),
      avatar: () => this.renderAvatar(),
      clear: () => '__CLEAR__'
    };
  }

  buildEasterEggs() {
    return {
      cloudpositive: `<span class="term-indigo">Access granted.</span> cp-api dynamic schema loaded. Multi-tenant isolation active.`,
      xmigrate: `<span class="term-indigo">eBPF hook verified.</span> Block dispatcher running on WS channel snapshot.`,
      wms: `<span class="term-indigo">WMS online.</span> Auto-compliance cron active [AT timezone]. Barcode scanner ready.`,
      exoticgreen: `<span class="term-indigo">WMS online.</span> Auto-compliance cron active [AT timezone]. Barcode scanner ready.`,
      dcsl: `<span class="term-indigo">CDA platform loaded.</span> English/Arabic RTL active. Passwordless auth online.`,
      cda: `<span class="term-indigo">CDA platform loaded.</span> English/Arabic RTL active. Passwordless auth online.`,
      medicine: `<span class="term-indigo">Medicine Bot online.</span> Durable state replay ready. Bedrock Nova Lite parser active.`,
      matrix: `<span class="term-indigo">Wake up, Neo…</span> The Matrix has you. Follow the white rabbit. 🐇`
    };
  }

  bindEvents() {
    const markInteracted = () => {
      this.hasInteracted = true;
      if (this.autoPlayTimeout) {
        clearTimeout(this.autoPlayTimeout);
        this.autoPlayTimeout = null;
      }
      if (this.statusbarMode) {
        this.statusbarMode.classList.add('interactive');
        this.statusbarMode.innerText = '❐ INTERACTIVE';
      }
      this.resetIdleTimer();
    };

    this.input.addEventListener('input', () => {
      markInteracted();
      this.syncDisplay();
    });

    this.body.addEventListener('click', () => {
      markInteracted();
      if (!this.isTouchDevice()) this.input.focus();
    });

    if (this.isTouchDevice()) {
      this.body.addEventListener('touchend', (e) => {
        markInteracted();
        if (!e.target.closest('a')) this.input.focus();
      }, { passive: true });
    }

    this.input.addEventListener('keydown', (e) => {
      markInteracted();
      // 1. Enter key
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleCommand();
        return;
      }

      // 2. Escape key
      if (e.key === 'Escape') {
        if (this.reverseSearchMode) {
          this.exitReverseSearch(false);
          e.preventDefault();
        }
        return;
      }

      // 3. Ctrl+R: Reverse search
      if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
        e.preventDefault();
        this.triggerReverseSearch();
        return;
      }

      // 4. Tab key: Autocomplete
      if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabCompletion();
        return;
      }

      // 5. Arrow Right / End: Accept suggestion
      if (e.key === 'ArrowRight' || e.key === 'End') {
        const suggestion = this.getGhostSuggestion();
        if (suggestion && this.input.selectionStart === this.input.value.length) {
          e.preventDefault();
          this.input.value += suggestion;
          this.syncDisplay();
        }
        return;
      }

      // 6. Arrow Up / Down: History traversal
      if (e.key === 'ArrowUp') {
        if (!this.reverseSearchMode) {
          e.preventDefault();
          this.traverseHistory(1);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        if (!this.reverseSearchMode) {
          e.preventDefault();
          this.traverseHistory(-1);
        }
        return;
      }
    });
  }

  syncDisplay() {
    if (!this.display || !this.input) return;

    if (this.reverseSearchMode) {
      this.performReverseSearch(false);

      const activeLine = this.input.closest('.terminal-line');
      if (activeLine) {
        const promptEl = activeLine.querySelector('.terminal-prompt');
        if (promptEl) {
          const query = this.input.value;
          promptEl.innerHTML = `<span class="term-red" style="font-weight:bold">(reverse-i-search)</span>\`<span class="term-yellow">${query}</span>': `;
        }
      }

      if (this.reverseSearchMatch) {
        const match = this.reverseSearchMatch;
        const escapedQuery = this.input.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        let highlighted = match;
        if (escapedQuery) {
          const regex = new RegExp(`(${escapedQuery})`, 'gi');
          highlighted = match.replace(regex, `<span class="term-yellow" style="text-decoration:underline">$1</span>`);
        }
        this.display.innerHTML = highlighted;
      } else {
        this.display.innerHTML = `<span class="term-gray">[no match]</span>`;
      }
    } else {
      const typed = this.input.value;
      const escaped = typed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const suggestion = this.getGhostSuggestion();
      this.display.innerHTML = suggestion
        ? `${escaped}<span class="terminal-ghost-text">${suggestion}</span>`
        : escaped;
    }
  }

  handleCommand() {
    let raw = this.input.value;

    if (this.reverseSearchMode) {
      if (this.reverseSearchMatch) {
        raw = this.reverseSearchMatch;
      }
      this.exitReverseSearch(true);
    }

    const cmd = raw.trim().toLowerCase();

    this.echoCommand(raw);

    if (cmd) {
      // Add to history list
      if (this.history[this.history.length - 1] !== raw) {
        this.history.push(raw);
        if (this.history.length > 50) this.history.shift();
        this.saveHistory();
      }
      this.historyIndex = -1;

      if (cmd === 'clear') {
        const active = this.input.closest('.terminal-line');
        Array.from(this.body.children).forEach(el => {
          if (el !== active) el.remove();
        });
      } else if (this.commands[cmd]) {
        const result = this.commands[cmd]();
        if (result !== '__CLEAR__') this.renderOutput(result);
      } else if (this.easterEggs[cmd]) {
        this.renderOutput(this.easterEggs[cmd]);
      } else {
        const resolvedCmd = this.resolveSmartCommand(cmd);
        if (resolvedCmd) {
          this.renderOutput(`<span class="term-cyan">ℹ Command not found. Automagic resolved to: </span><span class="term-yellow">"${resolvedCmd}"</span>`);
          setTimeout(() => {
            const result = this.commands[resolvedCmd] ? this.commands[resolvedCmd]() : this.easterEggs[resolvedCmd];
            if (result && result !== '__CLEAR__') {
              this.renderOutput(result);
            } else if (result === '__CLEAR__') {
              const active = this.input.closest('.terminal-line');
              Array.from(this.body.children).forEach(el => {
                if (el !== active) el.remove();
              });
            }
          }, 600);
        } else {
          this.renderOutput(`<span class="term-gray">Command not found: </span><span style="color:var(--hi)">"${cmd}"</span><span class="term-gray"> — type </span><span class="term-yellow">help</span><span class="term-gray"> for a list.</span>`);
        }
      }
    }

    this.input.value = '';
    this.syncDisplay();
    this.body.scrollTop = this.body.scrollHeight;
  }

  echoCommand(text) {
    const activeLine = this.input.closest('.terminal-line');
    const div = document.createElement('div');
    div.className = 'terminal-line';
    const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    div.innerHTML = `${this.prompt} <span class="term-indigo">${safe}</span>`;
    this.body.insertBefore(div, activeLine);
  }

  traverseHistory(dir) {
    if (this.history.length === 0) return;

    if (this.historyIndex === -1) {
      this.tempInput = this.input.value;
    }

    this.historyIndex += dir;

    if (this.historyIndex >= this.history.length) {
      this.historyIndex = this.history.length - 1;
    }

    if (this.historyIndex < -1) {
      this.historyIndex = -1;
    }

    if (this.historyIndex === -1) {
      this.input.value = this.tempInput;
    } else {
      this.input.value = this.history[this.history.length - 1 - this.historyIndex];
    }

    this.syncDisplay();
  }

  getGhostSuggestion() {
    if (this.reverseSearchMode) return "";
    const val = this.input.value;
    if (!val) return "";

    const allCmds = [...Object.keys(this.commands), ...Object.keys(this.easterEggs)];
    const match = allCmds.find(c => c.startsWith(val.toLowerCase()) && c !== val.toLowerCase());
    if (match) {
      return match.substring(val.length);
    }
    return "";
  }

  handleTabCompletion() {
    if (this.reverseSearchMode) return;
    const typed = this.input.value.trim().toLowerCase();
    if (!typed) return;

    const allCmds = [...Object.keys(this.commands), ...Object.keys(this.easterEggs)];
    const matches = allCmds.filter(c => c.startsWith(typed));

    if (matches.length === 1) {
      this.input.value = matches[0];
      this.syncDisplay();
    } else if (matches.length > 1) {
      this.echoCommand(this.input.value);
      const listHtml = `<span class="term-cyan">${matches.join('    ')}</span>`;
      this.renderOutput(listHtml);
      setTimeout(() => {
        this.body.scrollTop = this.body.scrollHeight;
      }, 50);
    }
  }

  triggerReverseSearch() {
    if (!this.reverseSearchMode) {
      this.reverseSearchMode = true;
      this.reverseSearchHistoryIndex = -1;
      this.reverseSearchMatch = "";
      this.input.value = "";
    } else {
      this.performReverseSearch(true);
    }
    this.syncDisplay();
  }

  performReverseSearch(next = false) {
    const query = this.input.value.trim().toLowerCase();
    if (!query) {
      this.reverseSearchMatch = "";
      this.reverseSearchHistoryIndex = -1;
      return;
    }

    let startIndex = this.reverseSearchHistoryIndex;
    if (next) {
      startIndex++;
    } else {
      startIndex = 0;
    }

    let match = "";
    let foundIndex = -1;

    for (let i = startIndex; i < this.history.length; i++) {
      const item = this.history[this.history.length - 1 - i];
      if (item.toLowerCase().includes(query)) {
        match = item;
        foundIndex = i;
        break;
      }
    }

    if (match) {
      this.reverseSearchMatch = match;
      this.reverseSearchHistoryIndex = foundIndex;
    } else if (next) {
      this.reverseSearchHistoryIndex = -1;
      this.performReverseSearch(false);
    } else {
      this.reverseSearchMatch = "";
      this.reverseSearchHistoryIndex = -1;
    }
  }

  exitReverseSearch(accept = true) {
    this.reverseSearchMode = false;
    const activeLine = this.input.closest('.terminal-line');
    if (activeLine) {
      const promptEl = activeLine.querySelector('.terminal-prompt');
      if (promptEl) {
        promptEl.innerHTML = `<span class="term-indigo">guest</span><span class="term-gray">@dev</span> <span class="term-gray">~</span> <span class="term-yellow">❯</span>`;
      }
    }
    if (accept && this.reverseSearchMatch) {
      this.input.value = this.reverseSearchMatch;
    } else if (!accept) {
      this.input.value = "";
    }
    this.reverseSearchMatch = "";
    this.reverseSearchHistoryIndex = -1;
    this.syncDisplay();
  }

  renderOutput(html) {
    const activeLine = this.input.closest('.terminal-line');
    const container = document.createElement('div');
    container.className = 'terminal-output';
    this.body.insertBefore(container, activeLine);

    const rawLines = html.split('\n');
    if (rawLines.length > 0 && rawLines[0].trim() === '') rawLines.shift();
    if (rawLines.length > 0 && rawLines[rawLines.length - 1].trim() === '') rawLines.pop();

    const lineElements = [];
    rawLines.forEach(lineText => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'terminal-output-row';
      lineDiv.style.display = 'none';
      lineDiv.innerHTML = lineText;
      container.appendChild(lineDiv);
      lineElements.push(lineDiv);
    });

    const delay = this.isMobile() ? 20 : 32;
    let index = 0;
    const revealNext = () => {
      if (index < lineElements.length) {
        lineElements[index].style.display = 'block';
        index++;
        this.body.scrollTop = this.body.scrollHeight;
        setTimeout(revealNext, delay);
      } else {
        this.body.scrollTop = this.body.scrollHeight;
      }
    };
    revealNext();
  }

  renderAvatar() {
    const id = 'av-' + Date.now();

    if (this.isSmallScreen()) {
      return `
<span class="term-indigo">Mathews Shaji — Backend-Leaning Full-Stack Engineer</span>
<span class="term-gray">──────────────────────────────────────────────────</span>
<span class="term-gray">Role:    </span>Backend-Leaning Full-Stack Developer
<span class="term-gray">Stack:   </span>Python · Go · TypeScript · AWS · GCP · Azure
<span class="term-gray">Bio:     </span>Building high-performance distributed systems.
<span class="term-gray">──────────────────────────────────────────────────</span>
<span class="term-gray">[Avatar unavailable on small screens — try on desktop!]</span>`;
    }

    setTimeout(() => {
      const pre    = document.getElementById(id + '-pre');
      const status = document.getElementById(id + '-status');
      if (!pre) return;

      status.innerHTML = `<span class="term-indigo">Loading text portrait…</span>`;

      fetch('/ascii-portrait.txt')
        .then(r => r.text())
        .then(text => {
          const lines = text.split('\n');
          pre.textContent = '';
          pre.style.color = 'var(--ac)';

          let line = 0;
          const tick = () => {
            if (line < lines.length) {
              pre.textContent += lines[line++] + '\n';
              this.body.scrollTop = this.body.scrollHeight;
              setTimeout(tick, 18);
            } else {
              status.innerHTML = `<span class="term-indigo">Render complete.</span>`;
            }
          };
          setTimeout(tick, 80);
        })
        .catch(() => {
          status.innerHTML = `<span class="term-yellow">Failed to load — using fallback vector.</span>`;
          const fallback = [
            "              ⢀⣀⣀⣀⣀⣀⡀       ",
            "          ⢀⣴⠶⠞⠛⠛⠛⠛⠳⠶⣦⡀   ",
            "        ⢀⡾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⡀  ",
            "       ⢠⡿⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⡄ ",
            "       ⣾⠁⠀⠀⢀⣀⡀⠀⠀⣀⡀⠀⠀⠈⢿",
            "      ⢹⡇⠀⠀⠀⠻⠟⠁⠀⠀⠻⠟⠀⠀⠀⠸⡏",
            "      ⠘⣧⠀⠀⠀⠀⠀⠠⠤⠄⠀⠀⠀⠀⠀⣼⠃",
            "       ⠘⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠃",
            "         ⠈⠻⢦⣀⡀⠀⠀⠀⢀⣀⡴⠟⠁  "
          ].join('\n');
          let line = 0; const flines = fallback.split('\n');
          pre.textContent = ''; pre.style.color = 'var(--ac-dim)';
          const tick = () => {
            if (line < flines.length) {
              pre.textContent += flines[line++] + '\n';
              this.body.scrollTop = this.body.scrollHeight;
              setTimeout(tick, 30);
            }
          };
          setTimeout(tick, 80);
        });
    }, 60);

    return `
<span class="term-indigo">Mathews Shaji — Backend-Leaning Full-Stack Engineer</span>
<span class="term-gray">──────────────────────────────────────────────────</span>
<span class="term-gray">Role:    </span>Backend-Leaning Full-Stack Developer
<span class="term-gray">Stack:   </span>Python · Go · TypeScript · AWS · GCP · Azure
<span class="term-gray">Bio:     </span>Building high-performance distributed systems.
<span class="term-gray">──────────────────────────────────────────────────</span>
<div id="${id}">
  <div id="${id}-status" class="term-gray">Querying portrait core…</div>
  <pre id="${id}-pre" style="font-family:'JetBrains Mono',monospace;font-size:6px;line-height:6.6px;white-space:pre;margin-top:.5rem;"></pre>
</div>`;
  }

  autoRunHelp() {
    const delay = this.isTouchDevice() ? 800 : 1500;
    setTimeout(() => {
      if (this.hasInteracted) return;

      // Clear terminal prior to running initial command
      const active = this.input.closest('.terminal-line');
      Array.from(this.body.children).forEach(el => {
        if (el !== active) el.remove();
      });

      this.echoCommand('whoami');
      const result = this.commands.whoami();
      this.renderOutput(result);
      this.body.scrollTop = this.body.scrollHeight;

      this.startAutomatedDemo();
    }, delay);
  }

  resetIdleTimer() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }

    this.idleTimeout = setTimeout(() => {
      this.hasInteracted = false;

      if (this.statusbarMode) {
        this.statusbarMode.classList.remove('interactive');
        this.statusbarMode.innerText = '❐ AUTO DEMO';
      }

      // Clear terminal prior to resuming auto mode
      const active = this.input.closest('.terminal-line');
      Array.from(this.body.children).forEach(el => {
        if (el !== active) el.remove();
      });

      this.startAutomatedDemo();
    }, 20000); // 20 seconds of inactivity
  }

  startAutomatedDemo() {
    if (this.hasInteracted) return;

    const sequence = ['help', 'about', 'skills', 'projects', 'contact', 'whoami'];
    let step = 0;

    const nextStep = () => {
      if (this.hasInteracted) return;

      if (step >= sequence.length) {
        step = 0;
      }

      const cmd = sequence[step];
      step++;

      this.autoPlayTimeout = setTimeout(() => {
        if (this.hasInteracted) return;

        // Clear terminal prior to each message in auto mode
        const active = this.input.closest('.terminal-line');
        Array.from(this.body.children).forEach(el => {
          if (el !== active) el.remove();
        });

        this.simulateTyping(cmd, () => {
          nextStep();
        });
      }, 7000);
    };

    nextStep();
  }

  simulateTyping(text, callback) {
    if (this.hasInteracted) return;
    let index = 0;
    this.input.value = '';
    this.syncDisplay();

    const typeChar = () => {
      if (this.hasInteracted) return;
      if (index < text.length) {
        this.input.value += text[index];
        this.syncDisplay();
        index++;
        setTimeout(typeChar, Math.random() * 50 + 50);
      } else {
        setTimeout(() => {
          if (this.hasInteracted) return;
          this.handleCommand();
          if (callback) callback();
        }, 700);
      }
    };

    typeChar();
  }

  resolveSmartCommand(input) {
    const clean = input.trim().toLowerCase();
    if (!clean) return null;

    // Direct mappings
    const mappings = {
      'help': 'help', 'commands': 'help', 'menu': 'help', 'info': 'help', 'list': 'help', 'options': 'help',
      'about': 'about', 'bio': 'about', 'who': 'about', 'me': 'about', 'mathews': 'about', 'shaji': 'about', 'myself': 'about', 'summary': 'about', 'profile': 'about',
      'skills': 'skills', 'tech': 'skills', 'stack': 'skills', 'languages': 'skills', 'frameworks': 'skills', 'technologies': 'skills', 'backend': 'skills', 'frontend': 'skills', 'cloud': 'skills', 'database': 'skills',
      'projects': 'projects', 'builds': 'projects', 'work': 'projects', 'portfolio': 'projects', 'apps': 'projects', 'websites': 'projects',
      'whoami': 'whoami', 'avatar': 'whoami', 'portrait': 'whoami', 'ascii': 'whoami', 'image': 'whoami', 'face': 'whoami',
      'socials': 'socials', 'social': 'socials', 'github': 'socials', 'linkedin': 'socials', 'git': 'socials', 'connect': 'socials',
      'contact': 'contact', 'email': 'contact', 'reach': 'contact', 'message': 'contact', 'hire': 'contact', 'job': 'contact', 'locate': 'contact', 'location': 'contact', 'phone': 'contact',
      'resume': 'resume', 'cv': 'resume', 'experience': 'resume', 'education': 'resume', 'career': 'resume', 'history': 'resume',
      'cloudpositive': 'cloudpositive', 'cp': 'cloudpositive',
      'xmigrate': 'xmigrate',
      'wms': 'wms', 'exoticgreen': 'wms',
      'cda': 'cda', 'dcsl': 'cda',
      'medicine': 'medicine', 'bot': 'medicine',
      'matrix': 'matrix', 'neo': 'matrix', 'rabbit': 'matrix'
    };

    if (mappings[clean]) {
      return mappings[clean];
    }

    // Substring match
    for (const key in mappings) {
      if (key.length > 2 && (clean.includes(key) || key.includes(clean))) {
        return mappings[key];
      }
    }

    // Levenshtein fuzzy match
    const allTargets = Object.keys(this.commands).concat(Object.keys(this.easterEggs));
    let bestMatch = null;
    let minDistance = 3; // Max edits allowed

    allTargets.forEach(target => {
      const dist = this.levenshtein(clean, target);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = target;
      }
    });

    return bestMatch;
  }

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            )
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}
