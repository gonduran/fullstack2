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