function editOrder(button) {
    var row = button.closest('tr');
    var clientName = row.cells[1].innerText;
    var productName = row.cells[2].innerText;
    var quantity = row.cells[3].innerText;
    var status = row.cells[4].innerText;

    document.getElementById('editClientName').value = clientName;
    document.getElementById('editProductName').value = productName;
    document.getElementById('editQuantity').value = quantity;
    document.getElementById('editStatus').value = status;

    var editOrderModal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    editOrderModal.show();
}

function removeOrder(button) {
    var row = button.closest('tr');
    row.remove();
}

document.getElementById('editOrderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var row = document.querySelector('#orderTable tr td:first-child').closest('tr');
    row.cells[1].innerText = document.getElementById('editClientName').value;
    row.cells[2].innerText = document.getElementById('editProductName').value;
    row.cells[3].innerText = document.getElementById('editQuantity').value;
    row.cells[4].innerText = document.getElementById('editStatus').value;

    var editOrderModal = bootstrap.Modal.getInstance(document.getElementById('editOrderModal'));
    editOrderModal.hide();
    alert('Order details updated successfully.');
    // Aquí puedes añadir la lógica para actualizar el pedido en el backend
});

document.getElementById('addOrderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var clientName = document.getElementById('addClientName').value;
    var productName = document.getElementById('addProductName').value;
    var quantity = document.getElementById('addQuantity').value;
    var status = document.getElementById('addStatus').value;
    var orderTable = document.getElementById('orderTable');
    var newRow = orderTable.insertRow();
    newRow.innerHTML = `
        <td>New</td>
        <td>${clientName}</td>
        <td>${productName}</td>
        <td>${quantity}</td>
        <td>${status}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editOrder(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="removeOrder(this)">Remove</button>
        </td>
    `;
    var addOrderModal = bootstrap.Modal.getInstance(document.getElementById('addOrderModal'));
    addOrderModal.hide();
    alert('New order added successfully.');
    // Aquí puedes añadir la lógica para añadir el nuevo pedido en el backend
});
