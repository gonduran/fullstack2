// Limpiar la variable de sesión y redirigir al usuario a la página de inicio de sesión
localStorage.removeItem('loggedInUserAdmin'); // Elimina el usuario logueado del localStorage
//window.location.href = 'login.html'; // Redirige al usuario a la página de inicio de sesión

// Comprobar si el usuario ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var loggedInUserAdmin = JSON.parse(localStorage.getItem('loggedInUserAdmin'));
    if (loggedInUserAdmin) {
        // Esta logueado, redirigir al administrador a ordenes de compra
        window.location.href = 'order-monitoring.html';
    } else {
        // No esta logueado, redirigir al administrador a login
        window.location.href = 'admin-login.html';
    }
});