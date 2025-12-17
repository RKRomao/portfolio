document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Projects data - you can customize this with your own projects
    const projects = [
        {
            id: 1,
            title: 'Project One',
            description: 'A brief description of project one and what it does.',
            image: 'https://via.placeholder.com/600x400?text=Project+One',
            tags: ['HTML', 'CSS', 'JavaScript']
        },
        {
            id: 2,
            title: 'Project Two',
            description: 'A brief description of project two and what it does.',
            image: 'https://via.placeholder.com/600x400?text=Project+Two',
            tags: ['React', 'Node.js', 'MongoDB']
        },
        {
            id: 3,
            title: 'Project Three',
            description: 'A brief description of project three and what it does.',
            image: 'https://via.placeholder.com/600x400?text=Project+Three',
            tags: ['Vue.js', 'Firebase', 'SASS']
        },
        {
            id: 4,
            title: 'Project Four',
            description: 'A brief description of project four and what it does.',
            image: 'https://via.placeholder.com/600x400?text=Project+Four',
            tags: ['Angular', 'TypeScript', 'Node.js']
        },
        {
            id: 5,
            title: 'Project Five',
            description: 'A brief description of project five and what it does.',
            image: 'https://via.placeholder.com/600x400?text=Project+Five',
            tags: ['Python', 'Django', 'PostgreSQL']
        },
        {
            id: 6,
            title: 'Project Six',
            description: 'A brief description of project six and what it does.',
            image: 'https://via.placeholder.com/600x400?text=Project+Six',
            tags: ['React Native', 'Expo', 'Firebase']
        }
    ];
    
    // Render projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card';
            projectElement.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        <a href="#" class="view-project" data-project-id="${project.id}">View Project</a>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            projectsContainer.appendChild(projectElement);
        });
        
        // Add click event for project cards
        document.querySelectorAll('.view-project').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const projectId = this.getAttribute('data-project-id');
                // You can add a modal or redirect to a project details page here
                alert(`Viewing project ${projectId}`);
            });
        });
    }
    
    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            const messageDiv = document.getElementById('form-message');
            if (messageDiv) {
                messageDiv.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <p>Thank you for your message, ${formObject.name}! I'll get back to you soon at ${formObject.email}.</p>
                    </div>
                `;
            }
            
            // Reset form
            this.reset();
        });
    }
    
    // Add active class to current navigation link
    const currentLocation = location.href;
    const navItems = document.querySelectorAll('.nav-links a');
    const navLength = navItems.length;
    
    for (let i = 0; i < navLength; i++) {
        if (navItems[i].href === currentLocation) {
            navItems[i].classList.add('active');
        }
    }
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.project-card, .skill, .timeline-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    document.addEventListener('DOMContentLoaded', function() {
        const elements = document.querySelectorAll('.project-card, .skill, .timeline-item');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Trigger animation on load
        setTimeout(animateOnScroll, 300);
    });
    
    // Animate on scroll
    window.addEventListener('scroll', animateOnScroll);
});
