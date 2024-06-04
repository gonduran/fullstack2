function editUser(button) {
    var row = button.closest('tr');
    var username = row.cells[0].innerText;
    var email = row.cells[1].innerText;
    var password = row.cells[2].innerText;

    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;
    document.getElementById('editPassword').value = password;

    var editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
}

function removeUser(button, index) {
    var row = button.closest('tr');
    row.remove();
    var users = JSON.parse(localStorage.getItem('users')) || [];
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    location.reload();
    alert('Usuario eliminado exitosamente.');
}

document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var row = document.querySelector('#userTable tr td:first-child').closest('tr');
    var username = document.getElementById('editUsername').value;
    var email = document.getElementById('editEmail').value;
	var password = document.getElementById('editPassword').value.trim();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }
    
    if (password === '') {
		alert('Las contraseñas esta vacia.');
		return;
	}
        
	if (!/(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(password)) {
		alert('La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una letra mayúscula.');
		return;
	}

    row.cells[0].innerText = username;
    row.cells[1].innerText = email;
    row.cells[2].innerText = password;

    var editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    editUserModal.hide();
    // Actualizar los datos del usuario en localStorage
    var users = JSON.parse(localStorage.getItem('users')) || [];

    var userIndex = users.findIndex(user => user.username === username && user.email === email);
    if (userIndex !== -1) {
		users[userIndex] = { username: username, email: email, password: password };
        localStorage.setItem('users', JSON.stringify(users));
	}
    alert('Usuario actualizado exitosamente.');
});

document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('addUsername').value;
    var email = document.getElementById('addEmail').value;
	var password = document.getElementById('addPassword').value.trim();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }
    
    if (password === '') {
		alert('Las contraseñas esta vacia.');
		return;
	}
        
	if (!/(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(password)) {
		alert('La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una letra mayúscula.');
		return;
	}

    var addUserModal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    addUserModal.hide();
    // Guardar los datos del usuario en localStorage
    var users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username: username, email: email, password: password });
    localStorage.setItem('users', JSON.stringify(users));
    location.reload();
    alert('Nuevo usuario agregado con éxito.');
	//window.location.href = 'user-management.html';
});

// Comprobar si el usuario ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var loggedInUserAdmin = JSON.parse(localStorage.getItem('loggedInUserAdmin'));
    if (loggedInUserAdmin) {
        // Esta logueado, mantener al administrador en la pagina
        console.log('Usuario ya esta logueado, mantener al administrador en la pagina');
    } else {
        // No esta logueado, redirigir al administrador a login
        window.location.href = 'admin-login.html';
    }

});