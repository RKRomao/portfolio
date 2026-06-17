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
        // Check if user is scrolled to the very bottom
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            currentSectionId = 'skills'; // Highlight skills at bottom if it's the last section
        } else {
            const scrollPosition = window.scrollY + 180; // offset for header
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
  }, { threshold: 0.5 });
  
  // Inicializa todas as barras em 0%
  skills.forEach(skill => {
    const skillLevel = skill.querySelector('.skill-level');
    if (skillLevel) {
      skillLevel.style.width = '0%';
      observer.observe(skill);
    }
  });
};

// Initialize animations when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Initialize skill bars
  animateSkillBars();
  
  // Re-run animations when the page is resized (in case of layout shifts)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const skillLevels = document.querySelectorAll('.skill-level');
      skillLevels.forEach(level => {
        level.style.width = '0%';
      });
      animateSkillBars();
    }, 250);
  });
});

// Handle contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(contactForm.action || '/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success popup
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
                
                // Reset form
                contactForm.reset();
                
                // Close popup when OK is clicked
                popup.querySelector('.close-popup').addEventListener('click', () => {
                    popup.remove();
                });
                
                // Auto-close after 5 seconds
                setTimeout(() => {
                    popup.remove();
                }, 5000);
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}
