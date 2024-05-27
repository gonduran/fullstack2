// Show loading screen on navigation
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const href = this.getAttribute('href');
        const loadingScreen = document.getElementById('loading-screen');
        
        loadingScreen.classList.add('active');
        
        setTimeout(() => {
            window.location.href = href;
        }, 1000); // Adjust delay as needed
    });
});
