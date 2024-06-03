// Manejar el botón "Volver"
document.getElementById('backButton').addEventListener('click', function() {
    //window.history.back();
    window.location.href = 'product-catalog.html';
});

// Manejar el botón "Agregar al Carro"
document.getElementById('addToCartButton').addEventListener('click', function() {
    var quantity = document.getElementById('quantity').value;
    var total = quantity * 10000;
    var product = {
        name: 'Lamina alumnio',
        price: 10000,
        quantity: quantity,
        total: total,
        image: '../img/lamina_aluminio1.png'
    };

    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Producto agregado al carro.');
});

// Comprobar si el usuario ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        // Ocultar el menú "Iniciar Sesión" y "Registro Cliente" 
        document.getElementById('loginMenu').style.display = 'none';
        document.getElementById('registerMenu').style.display = 'none';
        // mostrar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu').style.display = 'block';
        document.getElementById('logoutMenu').style.display = 'block';
    } else {
        // Ocultar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu').style.display = 'none';
        document.getElementById('logoutMenu').style.display = 'none';
        // mostrar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu').style.display = 'block';
        document.getElementById('registerMenu').style.display = 'block';        
    }
});