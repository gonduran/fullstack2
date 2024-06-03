var menuToggle = document.getElementById("menu-toggle");
var wrapper = document.getElementById("wrapper");

menuToggle.addEventListener("click", function() {
    wrapper.classList.toggle("toggled");
});
