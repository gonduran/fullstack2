function editProduct(button) {
    var row = button.closest('tr');
    var productName = row.cells[1].innerText;
    var productPrice = row.cells[2].innerText.replace('$', '');
    var productQuantity = row.cells[3].innerText;

    document.getElementById('editProductName').value = productName;
    document.getElementById('editProductPrice').value = productPrice;
    document.getElementById('editProductQuantity').value = productQuantity;

    var editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editProductModal.show();
}

function removeProduct(button) {
    var row = button.closest('tr');
    row.remove();
}

document.getElementById('editProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var row = document.querySelector('#productTable tr td:first-child').closest('tr');
    row.cells[1].innerText = document.getElementById('editProductName').value;
    row.cells[2].innerText = '$' + parseFloat(document.getElementById('editProductPrice').value).toFixed(2);
    row.cells[3].innerText = document.getElementById('editProductQuantity').value;

    var editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
    editProductModal.hide();
    alert('Detalles del producto actualizados exitosamente.');
    // Aquí puedes añadir la lógica para actualizar el producto en el backend
});

document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var productName = document.getElementById('addProductName').value;
    var productPrice = parseFloat(document.getElementById('addProductPrice').value).toFixed(2);
    var productQuantity = document.getElementById('addProductQuantity').value;
    var productTable = document.getElementById('productTable');
    var newRow = productTable.insertRow();
    newRow.innerHTML = `
        <td>New</td>
        <td>${productName}</td>
        <td>$${productPrice}</td>
        <td>${productQuantity}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editProduct(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="removeProduct(this)">Remove</button>
        </td>
    `;
    var addProductModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    addProductModal.hide();
    alert('Nuevo producto agregado exitosamente.');
    // Aquí puedes añadir la lógica para añadir el nuevo producto en el backend
});
