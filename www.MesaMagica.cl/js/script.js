document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    
    if (!nombreCompleto || !nombreUsuario || !email || !password || !confirmPassword || !fechaNacimiento) {
        alert('Todos los campos excepto la dirección de despacho son obligatorios.');
        return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    
    if (!/(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(password)) {
        alert('La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una letra mayúscula.');
        return;
    }
    
    const currentDate = new Date();
    const birthDate = new Date(fechaNacimiento);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 13) {
        alert('Debe tener al menos 13 años para registrarse.');
        return;
    }
    
    alert('Registro exitoso!');
    this.reset();
});

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
