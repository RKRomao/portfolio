/**
 * RICARDO ROMÃO - INTERACTIVE RECRUITER CLI TERMINAL
 * Easter Egg Command Line Interface for Recruiters & Tech Enthusiasts
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('terminal-modal');
    const closeBtn = document.getElementById('terminal-close-btn');
    const triggerBtn = document.getElementById('terminal-trigger-btn');
    const helpBtn = document.getElementById('terminal-help-btn');
    const inputForm = document.getElementById('terminal-input-form');
    const inputField = document.getElementById('terminal-input');
    const outputContainer = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');

    if (!modal || !inputField) return;

    let commandHistory = [];
    let historyIndex = -1;
    let matrixActive = false;

    // Toggle Modal Open / Close
    function openTerminal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => inputField.focus(), 100);
    }

    function closeTerminal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Event Listeners for Triggers
    if (triggerBtn) triggerBtn.addEventListener('click', openTerminal);
    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
    if (helpBtn) helpBtn.addEventListener('click', () => runCommand('help'));

    // Also trigger on HUD Terminal Widget in Hero section if present
    document.querySelectorAll('.hud-terminal-widget, .hero-terminal-btn').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', openTerminal);
    });

    // Keyboard Shortcuts: ~ (backtick/tilde), Ctrl+K, Alt+T, ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeTerminal();
            return;
        }

        // Ctrl + K or Alt + T or ` (tilde)
        if ((e.ctrlKey && e.key.toLowerCase() === 'k') || 
            (e.altKey && e.key.toLowerCase() === 't') || 
            (e.key === '`' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
            e.preventDefault();
            if (modal.classList.contains('active')) {
                closeTerminal();
            } else {
                openTerminal();
            }
        }
    });

    // Handle Form Submit
    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawCmd = inputField.value.trim();
        if (!rawCmd) return;

        commandHistory.push(rawCmd);
        historyIndex = commandHistory.length;

        appendCommandLine(rawCmd);
        runCommand(rawCmd);
        inputField.value = '';
        scrollToBottom();
    });

    // History Navigation (Up / Down arrows)
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                inputField.value = commandHistory[historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputField.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                inputField.value = '';
            }
            e.preventDefault();
        }
    });

    function appendCommandLine(cmd) {
        const line = document.createElement('div');
        line.className = 'term-line term-input-echo';
        line.innerHTML = `<span class="term-prompt-user">recruiter@ricardo-romao:~$</span> <span class="term-cmd-text">${escapeHtml(cmd)}</span>`;
        outputContainer.appendChild(line);
    }

    function appendOutput(htmlContent) {
        const block = document.createElement('div');
        block.className = 'term-output-block';
        block.innerHTML = htmlContent;
        outputContainer.appendChild(block);
    }

    function scrollToBottom() {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Command Interpreter
    function runCommand(rawCmd) {
        const parts = rawCmd.trim().toLowerCase().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                appendOutput(`
                    <div class="term-help-grid">
                        <div class="term-help-item"><span class="cmd">whoami</span> - Candidate Bio & Education (UBI)</div>
                        <div class="term-help-item"><span class="cmd">skills</span> - Full technical stack & competencies</div>
                        <div class="term-help-item"><span class="cmd">projects</span> - Highlighted P2P & Cybersecurity engineering projects</div>
                        <div class="term-help-item"><span class="cmd">cv</span> - Download Ricardo's official Resume / CV PDF</div>
                        <div class="term-help-item"><span class="cmd">contact</span> - Direct recruiter communication channel</div>
                        <div class="term-help-item"><span class="cmd">hire</span> - Open direct contact form to send job offers</div>
                        <div class="term-help-item"><span class="cmd">sudo hire_ricardo</span> - [EASTER EGG] Fast-track recruiter access code</div>
                        <div class="term-help-item"><span class="cmd">matrix</span> - Toggle Digital Rain visual mode</div>
                        <div class="term-help-item"><span class="cmd">clear</span> - Clear terminal buffer</div>
                        <div class="term-help-item"><span class="cmd">exit</span> - Close terminal console</div>
                    </div>
                `);
                break;

            case 'whoami':
                appendOutput(`
                    <div class="term-card">
                        <div class="term-card-title">👤 PROFILE: RICARDO KÖENIG ROMÃO</div>
                        <p><strong>Current Roles:</strong> Associate Researcher at <span class="term-cyan">sins-lab (UBI)</span> | Project Leader at <span class="term-magenta">Cyber Crow (TecStorm '26 Finalist)</span></p>
                        <p><strong>Education:</strong> B.Sc. Degree in Computer Science & Engineering (Informática Web, Movel e na Nuvem) - <span class="term-cyan">University of Beira Interior (2023 - 2026)</span></p>
                        <p><strong>Focus:</strong> Full-Stack Engineering, Peer-to-Peer Networks, Distributed Systems, Zero-Knowledge Encryption & Web Security.</p>
                        <p><strong>Location:</strong> Covilhã / Portugal (Available for Hybrid & Remote opportunities worldwide)</p>
                    </div>
                `);
                break;

            case 'skills':
                appendOutput(`
                    <div class="term-card">
                        <div class="term-card-title">⚡ TECHNICAL ARSENAL</div>
                        <p><span class="term-cyan">Backend & Systems:</span> Node.js, Express, Python, C/C++, Java, REST APIs, Microservices, WebSockets</p>
                        <p><span class="term-cyan">Frontend:</span> JavaScript (ES6+), EJS, HTML5, CSS3/SASS, Responsive Web Apps, Interactive Canvases</p>
                        <p><span class="term-cyan">Cybersecurity & P2P:</span> E2E Encryption, Distributed Ledger, Network Hardening, Vulnerability Analysis, Web App Auditing</p>
                        <p><span class="term-cyan">DevOps & Cloud:</span> Git, GitHub Actions, Docker, Linux Administration, Vercel, Netlify</p>
                    </div>
                `);
                break;

            case 'projects':
                appendOutput(`
                    <div class="term-card">
                        <div class="term-card-title">🚀 HIGHLIGHTED PROJECTS</div>
                        <p>1. <span class="term-cyan">Cyber Crow</span> - TecStorm '26 Finalist P2P Cybersecurity Platform</p>
                        <p>2. <span class="term-cyan">sins-lab Microservices</span> - Secure & Intelligent Networked Software Systems</p>
                        <p>3. <span class="term-cyan">iartes.ubi.pt</span> - Web platform support & Cyberattack Mitigation</p>
                        <p>4. <span class="term-cyan">Our Houses</span> - Full-Stack Real Estate Web Application</p>
                        <p class="term-hint">// Click on 'PROJETOS' in the main menu to inspect full technical documentation!</p>
                    </div>
                `);
                break;

            case 'cv':
            case 'resume':
            case 'download':
                appendOutput(`
                    <p class="term-emerald">✓ Initializing Resume Download...</p>
                    <p>Fetching PDF from: <code>/files/CV.pdf</code></p>
                `);
                const basePath = window.location.pathname.startsWith('/portfolio') ? '/portfolio' : '';
                window.open(basePath + '/files/CV.pdf', '_blank');
                break;

            case 'contact':
            case 'email':
                appendOutput(`
                    <div class="term-card">
                        <div class="term-card-title">📬 RECRUITER CONTACT INFORMATION</div>
                        <p>Email: <a href="mailto:koenig.romao@gmail.com" class="term-cyan">koenig.romao@gmail.com</a></p>
                        <p>GitHub: <a href="https://github.com/RKRomao" target="_blank" class="term-cyan">github.com/RKRomao</a></p>
                        <p>Location: Covilhã, Portugal</p>
                        <p>Status: <span class="term-emerald">AVAILABLE FOR HIRE / RECRUITMENT</span></p>
                    </div>
                `);
                break;

            case 'hire':
                appendOutput(`
                    <p class="term-emerald">✓ Redirecting to Recruiter Contact Form...</p>
                `);
                closeTerminal();
                window.location.href = (window.location.pathname.startsWith('/portfolio') ? '/portfolio' : '') + '/contact';
                break;

            case 'sudo':
                if (args.join('_') === 'hire_ricardo' || args[0] === 'hire') {
                    appendOutput(`
                        <div class="term-card term-sudo-card">
                            <div class="term-sudo-granted">
                                🔓 [ACCESS GRANTED] ROOT PRIVILEGES UNLOCKED
                            </div>
                            <p class="term-cyan" style="font-size: 1.1rem; margin: 0.5rem 0;">🎉 You just found the Recruiter Easter Egg!</p>
                            <p><strong>Candidate Match Score:</strong> <span class="term-emerald">100% EXCELLENT</span></p>
                            <p>Ricardo is open to software engineering, full-stack, and cybersecurity roles!</p>
                            <a href="mailto:koenig.romao@gmail.com?subject=Job%20Opportunity%20-%20Recruiter%20Contact" class="btn btn-laser btn-primary" style="display: inline-block; margin-top: 0.75rem; padding: 0.5rem 1.25rem; font-size: 0.85rem;">✉️ Send Instant Interview Offer</a>
                        </div>
                    `);
                } else {
                    appendOutput(`<p class="term-error">sudo: ${escapeHtml(args.join(' '))}: command not found. Try 'sudo hire_ricardo'.</p>`);
                }
                break;

            case 'matrix':
                matrixActive = !matrixActive;
                if (window.toggleMatrixMode) {
                    window.toggleMatrixMode(matrixActive);
                }
                appendOutput(`<p class="term-emerald">✓ Matrix Digital Rain visual mode: <strong>${matrixActive ? 'ENABLED' : 'DISABLED'}</strong></p>`);
                break;

            case 'clear':
            case 'cls':
                outputContainer.innerHTML = '';
                break;

            case 'exit':
            case 'quit':
                closeTerminal();
                break;

            default:
                appendOutput(`
                    <p class="term-error">Command not recognized: '<span class="term-white">${escapeHtml(cmd)}</span>'.</p>
                    <p class="term-hint">Type <span class="term-cyan">'help'</span> for a list of valid commands.</p>
                `);
                break;
        }
    }
});
