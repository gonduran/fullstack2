// scripts.js

// Function to handle form submission for adding a new client
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
    $('#addClientModal').modal('hide');
    alert('New client added successfully.');
    // Here you can add the logic to actually add the client to the backend
});

// Function to handle form submission for editing a client
document.getElementById('editClientForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var clientName = document.getElementById('editClientName').value;
    var clientEmail = document.getElementById('editClientEmail').value;
    var rows = document.getElementById('clientTable').rows;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerText === 'Edit') {
            rows[i].cells[1].innerText = clientName;
            rows[i].cells[2].innerText = clientEmail;
        }
    }
    $('#editClientModal').modal('hide');
    alert('Client details updated successfully.');
    // Here you can add the logic to actually update the client in the backend
});

// Function to edit a client
function editClient(button) {
    var row = button.closest('tr');
    var clientName = row.cells[1].innerText;
    var clientEmail = row.cells[2].innerText;

    document.getElementById('editClientName').value = clientName;
    document.getElementById('editClientEmail').value = clientEmail;

    $('#editClientModal').modal('show');
}

// Function to remove a client
function removeClient(button) {
    var row = button.closest('tr');
    row.remove();
}

// Function to handle form submission for adding a new profile
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
    $('#addProfileModal').modal('hide');
    alert('New profile added successfully.');
    // Here you can add the logic to actually add the profile to the backend
});

// Function to handle form submission for editing a profile
document.getElementById('editProfileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var profileName = document.getElementById('editProfileName').value;
    var rows = document.getElementById('profileTable').rows;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerText === 'Edit') {
            rows[i].cells[1].innerText = profileName;
        }
    }
    $('#editProfileModal').modal('hide');
    alert('Profile updated successfully.');
    // Here you can add the logic to actually update the profile in the backend
});

// Function to edit a profile
function editProfile(button) {
    var row = button.closest('tr');
    var profileName = row.cells[1].innerText;

    document.getElementById('editProfileName').value = profileName;

    $('#editProfileModal').modal('show');
}

// Function to remove a profile
function removeProfile(button) {
    var row = button.closest('tr');
    row.remove();
}

// Function to edit a user
function editUser(button) {
    var row = button.closest('tr');
    var userId = row.cells[0].innerText;
    var username = row.cells[1].innerText;
    var email = row.cells[2].innerText;
    var role = row.cells[3].innerText;

    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRole').value = role;

    $('#editUserModal').modal('show');
}

// Function to remove a user
function removeUser(button) {
    var row = button.closest('tr');
    row.remove();
}

document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    $('#editUserModal').modal('hide');
    alert('User details updated successfully.');
    // Here you can add the logic to actually update the user in the backend
});
