// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

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

// Add active class to current nav link
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});

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
            const response = await fetch('/contact', {
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
