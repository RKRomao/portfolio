document.addEventListener('DOMContentLoaded', () => {
    const shapes = document.querySelectorAll('.shape');
    
    // Initial position
    let mouseX = 0;
    let mouseY = 0;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    
    // Handle mouse movement
    const handleMouseMove = (e) => {
        mouseX = (e.clientX / windowWidth) * 2 - 1;
        mouseY = (e.clientY / windowHeight) * 2 - 1;
        updateShapes();
    };
    
    // Handle touch movement
    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            mouseX = (e.touches[0].clientX / windowWidth) * 2 - 1;
            mouseY = (e.touches[0].clientY / windowHeight) * 2 - 1;
            updateShapes();
        }
    };
    
    // Update shapes position based on mouse/touch
    const updateShapes = () => {
        const scrollY = window.scrollY;
        
        shapes.forEach(shape => {
            const speed = parseFloat(shape.getAttribute('data-speed')) || 0.1;
            const moveX = mouseX * 30 * speed;
            const moveY = mouseY * 30 * speed;
            const scrollMove = scrollY * 0.1 * speed;
            
            shape.style.transform = `translate(${moveX}px, ${moveY + scrollMove}px)`;
        });
    };
    
    // Handle window resize
    const handleResize = () => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateShapes);
    
    // Initial update
    updateShapes();
    
    // Add animation class after a short delay
    setTimeout(() => {
        document.querySelector('.parallax-shapes').classList.add('animate');
    }, 100);
});
