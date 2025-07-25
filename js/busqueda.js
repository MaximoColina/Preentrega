document.addEventListener("DOMContentLoaded", () => {
  const inputBusqueda = document.getElementById("busqueda-menu");
  const botonBuscar = document.getElementById("boton-buscar");
  const itemsMenu = document.querySelectorAll(".menu-principal li");

  function filtrarMenu() {
    const filtro = inputBusqueda.value.toLowerCase();
    itemsMenu.forEach(item => {
      const texto = item.textContent.toLowerCase();
      item.style.display = texto.includes(filtro) ? "" : "none";
    });
  }

  inputBusqueda.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      filtrarMenu();
    }
  });

  botonBuscar.addEventListener("click", filtrarMenu);
});



