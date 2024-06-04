document.getElementById('passwordRecoveryForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;

    if (!email) {
        alert('Dirección de correo electrónico es obligatorio.');
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }

    // Obtener los datos de los clientes del localStorage
    var customers = JSON.parse(localStorage.getItem('customers')) || [];

    // Validar las credenciales del usuario
    var customer = customers.find(customer => customer.email === email);
    if (customer) {
        alert('Se ha enviado un enlace de recuperación de contraseña a su correo electrónico.');
        // Aquí va la lógica para enviar el correo de recuperación
    } else {
        alert('Dirección de correo electrónico no registrada.');
    }
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