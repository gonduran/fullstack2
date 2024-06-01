document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const clientName = document.getElementById('clientName').value;
    const clientSurname = document.getElementById('clientSurname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const birthdate = document.getElementById('birthdate').value;
    const dispatchAddress = document.getElementById('dispatchAddress').value;
    
    if (!clientName || !clientSurname || !email || !password || !confirmPassword || !birthdate) {
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

    // Guardar los datos del cliente en localStorage
    var customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers.push({ clientName: clientName, clientSurname: clientSurname, email: email, password: password, birthdate: birthdate, dispatchAddress: dispatchAddress });
    localStorage.setItem('customers', JSON.stringify(customers));


    alert('Registro cliente exitoso!');
    document.getElementById('registerForm').reset();
});
