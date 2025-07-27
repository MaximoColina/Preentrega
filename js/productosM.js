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
  
  // Animación y actualización
  const button = event.target;
  button.classList.add('item-added-animation');
  setTimeout(() => {
    button.classList.remove('item-added-animation');
  }, 500);
  
  // Actualizar carrito
  if (typeof renderCarrito === 'function') {
    renderCarrito();
  }
  if (typeof updateCartCounter === 'function') {
    updateCartCounter();
  }
  
  // Mostrar notificación
  const notification = document.createElement('div');
  notification.textContent = '¡Producto agregado!';
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'var(--6)';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1001';
  notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2s forwards';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2500);
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