document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    event.preventDefault();
	var email = document.getElementById('adminUsername').value;
	var password = document.getElementById('adminPassword').value;

    if (!email || !password) {
        alert('Dirección de correo electrónico y contraseña son obligatorios.');
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }

    // Obtener los datos de los clientes del localStorage
    var users = JSON.parse(localStorage.getItem('users')) || [];

    // Validar las credenciales del usuario
    var user = users.find(user => user.email === email && user.password === password);
    if (user) {
        alert('Inicio de sesión exitoso!');

        // Guardar el estado de login en localStorage
        localStorage.setItem('loggedInUserAdmin', JSON.stringify(user));
        
        // Redirigir al administrador a ordenes de compra
        window.location.href = 'order-monitoring.html';
} else {
        alert('Usuario o contraseña invalidos.');
    }
});

// Comprobar si el usuario ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var loggedInUserAdmin = JSON.parse(localStorage.getItem('loggedInUserAdmin'));
    if (loggedInUserAdmin) {
        // Esta logueado, redirigir al administrador a ordenes de compra
        window.location.href = 'order-monitoring.html';
    } 
});