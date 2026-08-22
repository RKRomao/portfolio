// Mobile menu toggle logic is handled in navigation.js to prevent conflicts

// Set current year in footer
const currentYear = document.getElementById('current-year');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dynamic Active Nav Links & Scroll Spy
const currentPath = window.location.pathname;
const currentHash = window.location.hash;

if (currentPath !== '/') {
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-path') === currentPath) {
            link.classList.add('active');
        }
    });
} else {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    
    const scrollSpy = () => {
        let currentSectionId = 'home';
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            currentSectionId = 'skills';
        } else {
            const scrollPosition = window.scrollY + 180;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (currentSectionId === 'projects' && href === '/#projects') {
                link.classList.add('active');
            } else if ((currentSectionId === 'home' || currentSectionId === 'skills') && href === '/') {
                link.classList.add('active');
            }
        });
    };
    
    scrollSpy();
    window.addEventListener('scroll', scrollSpy);
}

// Animate skill bars when they come into view
const animateSkillBars = () => {
  const skills = document.querySelectorAll('.skill');
  if (!skills.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skill = entry.target;
        const skillLevel = skill.querySelector('.skill-level');
        const level = skill.getAttribute('data-level');
        
        if (skillLevel && level) {
          skillLevel.style.width = level + '%';
        }
        observer.unobserve(skill);
      }
    });
  }, { threshold: 0.3 });
  
  skills.forEach(skill => {
    const skillLevel = skill.querySelector('.skill-level');
    if (skillLevel) {
      skillLevel.style.width = '0%';
      observer.observe(skill);
    }
  });
};

// 3D Tilt Cards Effect
const init3DTiltCards = () => {
    const cards = document.querySelectorAll('.project-card, .skill-category, .stat-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
};

// Scroll Reveal Observer
const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.project-card, .skill-category, .stat-card, .timeline-item, .contact-card');
    revealElements.forEach(el => el.classList.add('reveal-hidden'));
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal-visible');
                }, idx * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
};

// Initialize animations when the page loads
document.addEventListener('DOMContentLoaded', () => {
  animateSkillBars();
  init3DTiltCards();
  initScrollReveal();
  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const skillLevels = document.querySelectorAll('.skill-level');
      skillLevels.forEach(level => level.style.width = '0%');
      animateSkillBars();
    }, 250);
  });
});

// Handle contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(contactForm.action || '/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();
            
            if (result.success) {
                const popup = document.createElement('div');
                popup.className = 'success-popup';
                popup.innerHTML = `
                    <div class="popup-content">
                        <i class="fas fa-check-circle"></i>
                        <h3>Message Sent Successfully!</h3>
                        <p>${result.message}</p>
                        <button class="close-popup">OK</button>
                    </div>
                `;
                document.body.appendChild(popup);
                contactForm.reset();
                popup.querySelector('.close-popup').addEventListener('click', () => popup.remove());
                setTimeout(() => popup.remove(), 5000);
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}
