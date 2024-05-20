function mostrarDetalles(titulo, descripcion, imagen) {
    document.getElementById('titulo-detalles').textContent = titulo;
    document.getElementById('descripcion-detalles').textContent = descripcion;
    document.getElementById('imagen-detalles').src = imagen;
    document.getElementById('detalles').style.display = 'block';
}

function cerrarDetalles() {
    document.getElementById('detalles').style.display = 'none';
}

function mostrar(element){
    // Mostrar la pantalla de carga
    document.getElementById('loading').style.display = 'flex';

    // Simular un retardo para la carga (por ejemplo, 1 segundo)
    setTimeout(function() {
        // Ocultar todos los artículos
        document.getElementById('home_div').style.display = 'none';
        document.getElementById('product_div').style.display = 'none';
        
        // Mostrar el artículo correspondiente
        switch (element.id) {
            case 'home':
                document.getElementById('home_div').style.display = 'block';
                break;
            case 'product':
                document.getElementById('product_div').style.display = 'block';
                break;
        }

        // Ocultar la pantalla de carga
        document.getElementById('loading').style.display = 'none';
    }, 1000); // 1000 milisegundos = 1 segundo


}