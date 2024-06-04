function editProfile(button) {
    var row = button.closest('tr');
    var profileName = row.cells[1].innerText;

    document.getElementById('editProfileName').value = profileName;

    var editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    editProfileModal.show();
}

function removeProfile(button) {
    var row = button.closest('tr');
    row.remove();
}

document.getElementById('editProfileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var row = document.querySelector('#profileTable tr td:first-child').closest('tr');
    row.cells[1].innerText = document.getElementById('editProfileName').value;

    var editProfileModal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    editProfileModal.hide();
    alert('Detalles del perfil actualizados exitosamente.');
    // Aquí puedes añadir la lógica para actualizar el perfil en el backend
});

document.getElementById('addProfileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var profileName = document.getElementById('addProfileName').value;
    var profileTable = document.getElementById('profileTable');
    var newRow = profileTable.insertRow();
    newRow.innerHTML = `
        <td>New</td>
        <td>${profileName}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editProfile(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="removeProfile(this)">Remove</button>
        </td>
    `;
    var addProfileModal = bootstrap.Modal.getInstance(document.getElementById('addProfileModal'));
    addProfileModal.hide();
    alert('Nuevo perfil agregado exitosamente.');
    // Aquí puedes añadir la lógica para añadir el nuevo perfil en el backend
});
