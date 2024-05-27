//
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const nombreUsuario = document.getElementById('nombreUsuario').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    
    if (!nombreCompleto || !nombreUsuario || !email || !password || !confirmPassword || !fechaNacimiento) {
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
    
    var currentDate = new Date();.
    var birthDate = new Date(fechaNacimiento);
    var age = currentDate.getFullYear() - birthDate.getFullYear();
    var monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
     
    if (age < 13) {
        alert('Debe tener al menos 13 años para registrarse.');
        return;
    }
	
    alert('Registro exitoso!');
    this.reset();
});
