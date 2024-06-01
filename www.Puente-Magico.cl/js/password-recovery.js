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