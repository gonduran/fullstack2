function mostrarDetalles(titulo, descripcion, imagen) {
    document.getElementById('titulo-detalles').textContent = titulo;
    document.getElementById('descripcion-detalles').textContent = descripcion;
    document.getElementById('imagen-detalles').src = imagen;
    document.getElementById('detalles').style.display = 'block';
}

function cerrarDetalles() {
    document.getElementById('detalles').style.display = 'none';
}
