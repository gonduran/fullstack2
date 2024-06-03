function editClient(button) {
    var row = button.closest('tr');
    var clientName = row.cells[1].innerText;
    var clientEmail = row.cells[2].innerText;

    document.getElementById('editClientName').value = clientName;
    document.getElementById('editClientEmail').value = clientEmail;

    var editClientModal = new bootstrap.Modal(document.getElementById('editClientModal'));
    editClientModal.show();
}

function removeClient(button) {
    var row = button.closest('tr');
    row.remove();
}

document.getElementById('editClientForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var row = document.querySelector('#clientTable tr td:first-child').closest('tr');
    row.cells[1].innerText = document.getElementById('editClientName').value;
    row.cells[2].innerText = document.getElementById('editClientEmail').value;

    var editClientModal = bootstrap.Modal.getInstance(document.getElementById('editClientModal'));
    editClientModal.hide();
    alert('Client details updated successfully.');
    // Aquí puedes añadir la lógica para actualizar el cliente en el backend
});

document.getElementById('addClientForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var clientName = document.getElementById('addClientName').value;
    var clientEmail = document.getElementById('addClientEmail').value;
    var clientTable = document.getElementById('clientTable');
    var newRow = clientTable.insertRow();
    newRow.innerHTML = `
        <td>New</td>
        <td>${clientName}</td>
        <td>${clientEmail}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editClient(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="removeClient(this)">Remove</button>
        </td>
    `;
    var addClientModal = bootstrap.Modal.getInstance(document.getElementById('addClientModal'));
    addClientModal.hide();
    alert('New client added successfully.');
    // Aquí puedes añadir la lógica para añadir el nuevo cliente en el backend
});
