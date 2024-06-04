document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var subject = document.getElementById('subject').value.trim();
    var message = document.getElementById('message').value.trim();

    if (name === '' || email === '' || subject === '' || message === '') {
        alert('Por favor rellene todos los campos.');
        return;
    }

    // Aquí se debe agregar el código para enviar el formulario a un servidor o manejarlo de otra manera

    alert('Tu mensaje ha sido enviado!');
    document.getElementById('contactForm').reset();
});

// Comprobar si el usuario ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        // Ocultar el menú "Iniciar Sesión" y "Registro Cliente" 
        document.getElementById('loginMenu').style.display = 'none';
        document.getElementById('registerMenu').style.display = 'none';
        // mostrar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu').style.display = 'block';
        document.getElementById('logoutMenu').style.display = 'block';
    } else {
        // Ocultar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu').style.display = 'none';
        document.getElementById('logoutMenu').style.display = 'none';
        // mostrar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu').style.display = 'block';
        document.getElementById('registerMenu').style.display = 'block';        
    }
});