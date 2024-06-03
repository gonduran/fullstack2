function editUser(button) {
    var row = button.closest('tr');
    var username = row.cells[1].innerText;
    var email = row.cells[2].innerText;

    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;

    var editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
}

function removeUser(button) {
    var row = button.closest('tr');
    row.remove();
}

document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var row = document.querySelector('#userTable tr td:first-child').closest('tr');
    row.cells[1].innerText = document.getElementById('editUsername').value;
    row.cells[2].innerText = document.getElementById('editEmail').value;

    var editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    editUserModal.hide();
    alert('User details updated successfully.');
    // Aquí puedes añadir la lógica para actualizar el usuario en el backend
});

document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('addUsername').value;
    var email = document.getElementById('addEmail').value;
    var userTable = document.getElementById('userTable');
    var newRow = userTable.insertRow();
    newRow.innerHTML = `
        <td>New</td>
        <td>${username}</td>
        <td>${email}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editUser(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="removeUser(this)">Remove</button>
        </td>
    `;
    var addUserModal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    addUserModal.hide();
    alert('New user added successfully.');
    // Aquí puedes añadir la lógica para añadir el nuevo usuario en el backend
});
