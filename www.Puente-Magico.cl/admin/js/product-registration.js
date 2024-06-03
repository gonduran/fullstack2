document.getElementById('productRegistrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var productName = document.getElementById('productName').value;
    var productPrice = document.getElementById('productPrice').value;
    var productQuantity = document.getElementById('productQuantity').value;
    var productDescription = document.getElementById('productDescription').value;

    // Aquí puedes añadir la lógica para registrar el producto en el backend

    alert('Producto registrado exitosamente.');
    document.getElementById('productRegistrationForm').reset();
});
