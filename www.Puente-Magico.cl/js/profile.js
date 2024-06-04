document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const clientName = document.getElementById('clientName').value;
    const clientSurname = document.getElementById('clientSurname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const dispatchAddress = document.getElementById('dispatchAddress').value;
    
    if (!clientName || !clientSurname || !email || !birthdate) {
        alert('Todos los campos excepto la contraseña y dirección de despacho son obligatorios.');
        return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }
    
    if (!(password === '')) {
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        
        if (!/(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(password)) {
            alert('La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una letra mayúscula.');
            return;
        }
    }
    
    // Validar la edad
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 13) {
        alert('Debe tener al menos 13 años para registrarse.');
        return;
    }

    // Actualizar los datos del cliente en localStorage
    var customers = JSON.parse(localStorage.getItem('customers')) || [];
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    var userIndex = customers.findIndex(customer => customer.clientName === loggedInUser.clientName && customer.email === loggedInUser.email);
    if (userIndex !== -1) {
        if (password === '') {
            console.log('Cliente no cambia su contraseña');
            const passwordSC = loggedInUser.password;
            customers[userIndex] = { clientName: clientName, clientSurname: clientSurname, email: email, password: passwordSC, birthdate: birthdate, dispatchAddress: dispatchAddress };
        }
        else {
            console.log('Cliente cambia su contraseña');
            customers[userIndex] = { clientName: clientName, clientSurname: clientSurname, email: email, password: password, birthdate: birthdate, dispatchAddress: dispatchAddress };
        }
        localStorage.setItem('customers', JSON.stringify(customers));

        // Actualizar los datos del cliente logueado en localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(customers[userIndex]));

        alert('Perfil cliente actualizado con éxito.');
    } else {
        alert('Error al actualizar el perfil cliente.');
    }
});

// Comprobar si el usuario ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        // Mostrar los datos del usuario en la página de perfil
        console.log('Cliente ya esta logueado, cargar sus datos en formulario para actualización');
        document.getElementById('clientName').value = loggedInUser.clientName;
        document.getElementById('clientSurname').value = loggedInUser.clientSurname;
        document.getElementById('password').value = loggedInUser.password;
        document.getElementById('confirmPassword').value = loggedInUser.confirmPassword;
        document.getElementById('email').value = loggedInUser.email;
        document.getElementById('birthdate').value = loggedInUser.birthdate;
        document.getElementById('dispatchAddress').value = loggedInUser.dispatchAddress;
        
        // Ocultar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu').style.display = 'none';
        document.getElementById('registerMenu').style.display = 'none';
        console.log('Ocultar el menú Iniciar Sesión y Registro Cliente');

        // Mostrar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu').style.display = 'block';
        document.getElementById('logoutMenu').style.display = 'block';
        console.log('Mostrar el menú Perfil Cliente y Cerrar Sesión');
    } else {
        console.log('Cliente no esta logueado');
        // Ocultar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu').style.display = 'none';
        document.getElementById('logoutMenu').style.display = 'none';
        console.log('Ocultar el menú Perfil Cliente y Cerrar Sesión');
        // Mostrar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu').style.display = 'block';
        document.getElementById('registerMenu').style.display = 'block';  
        console.log('Mostrar el menú Iniciar Sesión y Registro Cliente');      
    }
});