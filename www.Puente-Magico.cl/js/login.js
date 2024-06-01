document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Dirección de correo electrónico y contraseña son obligatorios.');
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }

    // Obtener los datos de los clientes del localStorage
    var customers = JSON.parse(localStorage.getItem('customers')) || [];

    // Validar las credenciales del usuario
    var customer = customers.find(customer => customer.email === email && customer.password === password);
    if (customer) {
        alert('Inicio de sesión exitoso!');
        // Aquí puedes redirigir al usuario a otra página o realizar alguna acción
    } else {
        alert('Usuario o contraseña invalidos.');
    }
});