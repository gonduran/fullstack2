function editClient(button) {
    var row = button.closest('tr');
    var clientName = row.cells[0].innerText;
    var clientSurname = row.cells[1].innerText;
    var clientEmail = row.cells[2].innerText;
    var clientPassword = row.cells[3].innerText;

    document.getElementById('editClientName').value = clientName;
    document.getElementById('editClientSurname').value = clientSurname;
    document.getElementById('editClientEmail').value = clientEmail;
    document.getElementById('editClientPassword').value = clientPassword;

    var editClientModal = new bootstrap.Modal(document.getElementById('editClientModal'));
    editClientModal.show();
}

function removeClient(button, index) {
    var row = button.closest('tr');
    row.remove();
    var customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers.splice(index, 1);
    localStorage.setItem('customers', JSON.stringify(customers));
    location.reload();
    alert('Cliente eliminado exitosamente.');
}

document.getElementById('editClientModal').addEventListener('submit', function(event) {
    event.preventDefault();
    var row = document.querySelector('#clientTable tr td:first-child').closest('tr');
    var clientName = document.getElementById('editClientName').value;
    var clientSurname = document.getElementById('editClientSurname').value;
    var clientEmail = document.getElementById('editClientEmail').value;
	var clientPassword = document.getElementById('editClientPassword').value.trim();
	var birthdate = '';
	var dispatchAddress = '';

    if (!/^\S+@\S+\.\S+$/.test(clientEmail)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }
    
    if (clientPassword === '') {
		alert('Las contraseñas esta vacia.');
		return;
	}
        
	if (!/(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(clientPassword)) {
		alert('La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una letra mayúscula.');
		return;
	}

    row.cells[0].innerText = clientName;
    row.cells[1].innerText = clientSurname;
    row.cells[2].innerText = clientEmail;
    row.cells[3].innerText = clientPassword;

    var editClientModal = bootstrap.Modal.getInstance(document.getElementById('editClientModal'));
    editClientModal.hide();
    // Actualizar los datos del usuario en localStorage
    var customers = JSON.parse(localStorage.getItem('customers')) || [];

    var userIndex = customers.findIndex(user => user.username === username && user.email === email);
    if (userIndex !== -1) {
		customers[userIndex] = { clientName: clientName, clientSurname: clientSurname, email: clientEmail, password: clientPassword, birthdate: birthdate, dispatchAddress: dispatchAddress };
        localStorage.setItem('customers', JSON.stringify(customers));
	}
    alert('Cliente actualizado exitosamente.');
});

document.getElementById('addClientModal').addEventListener('submit', function(event) {
    event.preventDefault();
    var clientName = document.getElementById('addClientName').value;
    var clientSurname = document.getElementById('addClientSurname').value;
    var clientEmail = document.getElementById('addClientEmail').value;
	var clientPassword = document.getElementById('addClientPassword').value.trim();
	var birthdate = '';
	var dispatchAddress = '';

    if (!/^\S+@\S+\.\S+$/.test(clientEmail)) {
        alert('El formato del correo electrónico es incorrecto.');
        return;
    }
    
    if (clientPassword === '') {
		alert('Las contraseñas esta vacia.');
		return;
	}
        
	if (!/(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(clientPassword)) {
		alert('La contraseña debe tener entre 6 y 18 caracteres, al menos un número y una letra mayúscula.');
		return;
	}

    var addClientModal = bootstrap.Modal.getInstance(document.getElementById('addClientModal'));
    addClientModal.hide();
    // Guardar los datos del cliente en localStorage
    var customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers.push({ clientName: clientName, clientSurname: clientSurname, email: clientEmail, password: clientPassword, birthdate: birthdate, dispatchAddress: dispatchAddress });
    localStorage.setItem('customers', JSON.stringify(customers));
    location.reload();
    alert('Nuevo cliente agregado con éxito.');
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