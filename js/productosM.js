let todosLosProductos = [];

async function obtenerProductos() {
  const res = await fetch('https://api.jsonbin.io/v3/b/68847e1dae596e708fbbf4a6/latest');
  const data = await res.json();
  todosLosProductos = data.record.slice(9, 18); // productos 10 al 18
  renderProductos(todosLosProductos);
}

function renderProductos(productos) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = ''; // limpia productos anteriores
  if (productos.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }
  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button onclick="agregarAlCarrito(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price})">Agregar</button>
    `;
    contenedor.appendChild(card);
  });
}

function agregarAlCarrito(id, title, price) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
  carrito[id] = carrito[id] ? { ...carrito[id], cantidad: carrito[id].cantidad + 1 } : { title, price, cantidad: 1 };
  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert('Agregado al carrito');
}

function filtrarProductosPorTexto(texto) {
  const filtro = texto.toLowerCase();
  const resultado = todosLosProductos.filter(p => p.title.toLowerCase().includes(filtro));
  renderProductos(resultado);
}

// Integra el buscador visual a productos
document.addEventListener("DOMContentLoaded", () => {
  obtenerProductos();

  const inputBusqueda = document.getElementById("busqueda-menu");
  const botonBuscar = document.getElementById("boton-buscar");

  botonBuscar.addEventListener("click", () => {
    filtrarProductosPorTexto(inputBusqueda.value);
  });

  inputBusqueda.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      filtrarProductosPorTexto(inputBusqueda.value);
    }
  });
});