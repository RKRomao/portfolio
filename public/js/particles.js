/* ==========================================================================
   Cyber-Developer Canvas Particle & Neural Grid System + Matrix Mode
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 18), 70);
  const mouse = { x: null, y: null, radius: 160 };

  let isMatrixMode = false;
  const matrixChars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*<>[]{}';
  const fontSize = 14;
  let columns = Math.floor(width / fontSize);
  let drops = Array(columns).fill(1);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(1);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Global Matrix Mode Toggle Function
  window.toggleMatrixMode = function(enable) {
    isMatrixMode = enable !== undefined ? enable : !isMatrixMode;
    try {
      localStorage.setItem('matrix_mode', isMatrixMode ? 'true' : 'false');
    } catch (e) {}

    if (isMatrixMode) {
      drops = Array(columns).fill(1);
      document.body.classList.add('matrix-mode-active');
      updateMatrixTextReferences(true);
    } else {
      document.body.classList.remove('matrix-mode-active');
      updateMatrixTextReferences(false);
    }
  };

  // Restore Matrix Mode from localStorage on Page Load
  try {
    if (localStorage.getItem('matrix_mode') === 'true') {
      window.toggleMatrixMode(true);
    }
  } catch (e) {}

  function swapText(elementOrSelector, newText, isHtml) {
    const el = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
    if (!el) return;
    if (newText === null || newText === undefined) {
      if (el.dataset.origText) {
        if (el.dataset.isHtml === 'true') {
          el.innerHTML = el.dataset.origText;
        } else {
          el.innerText = el.dataset.origText;
        }
      }
    } else {
      if (!el.dataset.origText) {
        el.dataset.origText = isHtml ? el.innerHTML : el.innerText;
        el.dataset.isHtml = isHtml ? 'true' : 'false';
      }
      if (isHtml) {
        el.innerHTML = newText;
      } else {
        el.innerText = newText;
      }
    }
  }

  function updateMatrixTextReferences(active) {
    if (active) {
      // 1. Branding & Header
      swapText('.logo-title', 'ZION_OPERATOR');
      
      const navLinks = document.querySelectorAll('.nav-links a.nav-link');
      navLinks.forEach((link, idx) => {
        const codeSpan = link.querySelector('.nav-code');
        const codeHtml = codeSpan ? codeSpan.outerHTML : `<span class="nav-code">0${idx + 1}//</span>`;
        const href = link.getAttribute('href') || '';

        let matrixLabel = 'O CONSTRUCTO';
        if (href.includes('about')) matrixLabel = 'DOSSIER DE ZION';
        else if (href.includes('projects')) matrixLabel = 'FICHEIROS DA MATRIZ';
        else if (href.includes('contact')) matrixLabel = 'CABINE TELEFÓNICA';

        if (active) {
          if (!link.dataset.origText) {
            link.dataset.origText = link.innerHTML;
          }
          link.innerHTML = `${codeHtml} ${matrixLabel}`;
        }
      });

      // 2. Hero Section
      swapText('.hud-status-line', '<i class="fas fa-terminal"></i> SIMULATION_DISCONNECTED // BEM-VINDO AO MUNDO REAL', true);
      swapText('.hero-title', 'THOMAS A. ANDERSON <span class="highlight">// ALIAS: NEO</span>', true);
      swapText('.hero-subtitle', 'ACABASTE DE SAIR DA ILUSÃO. NADA DO QUE VISTE ANTES ERA REAL.');
      swapText('.hero-description', '"A Matriz é um sistema, Neo. Esse sistema é nosso inimigo." Thomas A. Anderson é o Operador do Constructo e Comandante da Resistência de Zion. O teu CV e a tua vida anterior deixaram de existir.');
      swapText('.hero-cta .btn-primary', '💊 MUNDO REAL (ZION)', true);
      swapText('.hero-cta .btn-secondary', '📞 EXTRAÇÃO DE EMERGÊNCIA', true);

      // 3. About Page / Section (Dossier do Mundo Real)
      swapText('.about-section .section-title', 'BEM-VINDO AO MUNDO REAL');
      swapText('.about-section .section-subtitle', '// "Desgraçadamente, ninguém pode dizer o que é a Matriz. Tens de a ver por ti mesmo."');
      swapText('.about-bio', '<p>Desconectado do simulacro em 2199 por Morpheus. Removidos todos os rastreadores neurais dos Agentes Smith. Esta consola não contém currículos humanos tradicionais — apenas dados de operações táticas de Zion, combate de código em tempo real e descompilação da arquitetura central das máquinas.</p>', true);

      // Detail items on About Page (.about-details)
      const detailItems = document.querySelectorAll('.about-details .detail-item');
      if (detailItems.length >= 4) {
        swapText(detailItems[0].querySelector('.detail-value'), 'Thomas A. Anderson (Neo)');
        swapText(detailItems[1].querySelector('.detail-value'), 'Comandante / O Escolhido');
        swapText(detailItems[2].querySelector('.detail-value'), 'Zion Core / Nave Nebuchadnezzar');
        swapText(detailItems[3].querySelector('.detail-value'), 'LIBERTAÇÃO DA HUMANIDADE');
      }

      // Stat Cards
      const statCards = document.querySelectorAll('.stat-card');
      if (statCards.length >= 4) {
        swapText(statCards[0].querySelector('.stat-number'), '6.2B');
        swapText(statCards[0].querySelector('.stat-label'), 'Mentes Conectadas à Matriz');
        swapText(statCards[1].querySelector('.stat-number'), '250K');
        swapText(statCards[1].querySelector('.stat-label'), 'Sentinelas Neutralizados');
        swapText(statCards[2].querySelector('.stat-number'), '0.001s');
        swapText(statCards[2].querySelector('.stat-label'), 'Tempo de Reação a Balas');
        swapText(statCards[3].querySelector('.stat-number'), '100%');
        swapText(statCards[3].querySelector('.stat-label'), 'Soberania de Livre-Arbítrio');
      }

      // Timeline / Cronologia Fictícia
      swapText('.timeline-title', 'REGISTOS DA REVOLUÇÃO DE ZION');
      const timelineItems = document.querySelectorAll('.timeline-item');
      if (timelineItems.length >= 3) {
        swapText(timelineItems[0].querySelector('h3'), 'EXTRACÇÃO DO TANQUE DE NUTRIÇÃO (2199)');
        swapText(timelineItems[0].querySelector('p'), 'Consumo da Pílula Vermelha. Desconexão do suporte de vida das máquinas e resgate pela tripulação da nave Nebuchadnezzar.');
        
        swapText(timelineItems[1].querySelector('h3'), 'TREINO INTENSIVO NO CONSTRUCTO (2203)');
        swapText(timelineItems[1].querySelector('p'), 'Carregamento neural de artes marciais e descompilação de código ("I know Kung Fu!"). Aprendizagem para manipular a gravidade virtual e desviar de balas.');
        
        swapText(timelineItems[2].querySelector('h3'), 'BATALHA FINAL E PAZ COM AS MÁQUINAS (2206)');
        swapText(timelineItems[2].querySelector('p'), 'Invasão da Cidade das Máquinas, neutralização definitiva do vírus Agente Smith e garantia de liberdade para todas as mentes humanas.');
      }

      // 4. Projects Section & Filter Tabs (Ficheiros da Matriz)
      swapText('.projects-section .section-title', 'FICHEIROS DA REVOLUÇÃO DE ZION');
      swapText('.projects-section .section-subtitle', '// "Eu só te posso mostrar a porta. Tu é que tens de a atravessar."');
      
      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        const filter = btn.dataset.filter;
        if (filter === 'all') swapText(btn, 'Todos os Ficheiros');
        else if (filter === 'web') swapText(btn, 'Sistemas do Hovercraft');
        else if (filter === 'cybersecurity') swapText(btn, 'Escudos de Zion');
        else if (filter === 'fullstack') swapText(btn, 'Núcleo do Oráculo');
      });

      // Update Project Cards
      document.querySelectorAll('.project-card').forEach(card => {
        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('.project-card-description');
        const viewBtn = card.querySelector('.view-project');
        const matrixTitle = card.dataset.matrixTitle;
        const matrixDesc = card.dataset.matrixDesc;

        if (titleEl && matrixTitle && matrixTitle !== 'undefined') {
          swapText(titleEl, matrixTitle);
        }
        if (descEl && matrixDesc && matrixDesc !== 'undefined') {
          swapText(descEl, `<p>${matrixDesc}</p>`, true);
        }
        if (viewBtn) {
          swapText(viewBtn, '<i class="fas fa-terminal"></i> EXECUTAR PROGRAMA DE ZION', true);
        }
      });

      // 5. Project Detail Page
      swapText('.back-link', '<i class="fas fa-arrow-left"></i> ⬅️ REGRESSAR A ZION', true);
      const detailTitle = document.querySelector('.project-header .project-title');
      const detailDesc = document.querySelector('.project-short-desc');
      if (detailTitle && detailTitle.dataset.matrixTitle && detailTitle.dataset.matrixTitle !== 'undefined') {
        swapText(detailTitle, detailTitle.dataset.matrixTitle);
      }
      if (detailDesc && detailDesc.dataset.matrixDesc && detailDesc.dataset.matrixDesc !== 'undefined') {
        swapText(detailDesc, `<p>${detailDesc.dataset.matrixDesc}</p>`, true);
      }

      // Project Detail Headers
      const projectDetailH3s = document.querySelectorAll('.project-details h3');
      if (projectDetailH3s.length >= 2) {
        swapText(projectDetailH3s[0], 'MÓDULOS DO HOVERCRAFT (TANK & DOZER)');
        swapText(projectDetailH3s[1], 'CAPACIDADES NEURAIS DO ESCOLHIDO');
      }

      // 6. Contact Section / Page (Cabine Telefónica de Extração)
      swapText('.contact-section .section-title', '📞 CABINE TELEFÓNICA DE EXTRAÇÃO');
      swapText('.contact-section .section-subtitle', '// "Tank, preciso de um sinal de saída agora mesmo!"');
      swapText('.hud-contact-title', 'SIGNAL_EXIT // FREQUÊNCIA_DE_ZION');
      swapText('.hud-contact-subtitle', 'Se estás cercado por Agentes Smith, envia a tua frequência de emergência diretamente para o operador Tank.');
      swapText('.btn-copy', '<i class="far fa-copy"></i> [ COPIAR FREQUÊNCIA DE ZION ]', true);
      swapText('.btn-contact-email', '⚡ INICIAR TELETRANSPORTE DE SAÍDA', true);

    } else {
      // Restore all text elements
      swapText('.logo-title', null);
      document.querySelectorAll('.nav-links a.nav-link').forEach(link => {
        if (link.dataset.origText) {
          link.innerHTML = link.dataset.origText;
        }
      });
      
      swapText('.hud-status-line', null);
      swapText('.hero-title', null);
      swapText('.hero-subtitle', null);
      swapText('.hero-description', null);
      swapText('.hero-cta .btn-primary', null);
      swapText('.hero-cta .btn-secondary', null);

      swapText('.about-section .section-title', null);
      swapText('.about-section .section-subtitle', null);
      swapText('.about-bio', null);

      document.querySelectorAll('.about-details .detail-item').forEach(item => {
        swapText(item.querySelector('.detail-value'), null);
      });

      document.querySelectorAll('.stat-card').forEach(card => {
        swapText(card.querySelector('.stat-number'), null);
        swapText(card.querySelector('.stat-label'), null);
      });

      swapText('.timeline-title', null);
      document.querySelectorAll('.timeline-item').forEach(item => {
        swapText(item.querySelector('h3'), null);
        swapText(item.querySelector('p'), null);
      });

      swapText('.projects-section .section-title', null);
      swapText('.projects-section .section-subtitle', null);
      document.querySelectorAll('.filter-btn').forEach(btn => swapText(btn, null));

      document.querySelectorAll('.project-card').forEach(card => {
        swapText(card.querySelector('h3'), null);
        swapText(card.querySelector('.project-card-description'), null);
        swapText(card.querySelector('.view-project'), null);
      });

      swapText('.back-link', null);
      swapText('.project-header .project-title', null);
      swapText('.project-short-desc', null);
      document.querySelectorAll('.project-details h3').forEach(h3 => swapText(h3, null));

      swapText('.contact-section .section-title', null);
      swapText('.contact-section .section-subtitle', null);
      swapText('.hud-contact-title', null);
      swapText('.hud-contact-subtitle', null);
      swapText('.btn-copy', null);
      swapText('.btn-contact-email', null);
    }
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? '#00f0ff' : '#ff007f';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawMatrixRain() {
    ctx.fillStyle = 'rgba(3, 6, 17, 0.15)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#00ff9d';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  function animate() {
    if (isMatrixMode) {
      drawMatrixRain();
    } else {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = 1 - dist / 140;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        if (mouse.x && mouse.y) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const malpha = 1 - mdist / mouse.radius;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 0, 127, ${malpha * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});
