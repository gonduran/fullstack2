// Limpiar la variable de sesión y redirigir al usuario a la página de inicio de sesión
localStorage.removeItem('loggedInUser'); // Elimina el usuario logueado del localStorage
//window.location.href = 'login.html'; // Redirige al usuario a la página de inicio de sesión

// Comprobar si el usuario ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        // Ocultar el menú "Iniciar Sesión" y "Registro Cliente" 
        document.getElementById('loginMenu').style.display = 'none';
        document.getElementById('registerMenu').style.display = 'none';
        // Mostrar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu').style.display = 'block';
        document.getElementById('logoutMenu').style.display = 'block';
    } else {
        // Ocultar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu').style.display = 'none';
        document.getElementById('logoutMenu').style.display = 'none';
        // Mostrar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu').style.display = 'block';
        document.getElementById('registerMenu').style.display = 'block';        
    }
});