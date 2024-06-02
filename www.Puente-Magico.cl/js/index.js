// Comprobar si el usuario ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        // Ocultar el menú "Iniciar Sesión" y "Registro Cliente" 
        document.getElementById('loginMenu').style.display = 'none';
        document.getElementById('registerMenu').style.display = 'none';
        // mostrar el menú "Perfil Cliente" y "Cerrar Sesión"
        var profileMenu = document.getElementById('profileMenu');
        if (profileMenu) {
            profileMenu.style.display = 'block';
            console.log('Profile menu mostrado');
        } else {
            console.log('Profile menu no encontrado');
        }
        var logoutMenu = document.getElementById('logoutMenu');
        if (logoutMenu) {
            logoutMenu.style.display = 'block';
            console.log('Logout menu mostrado');
        } else {
            console.log('Logout menu no encontrado');
        }
    } 
});