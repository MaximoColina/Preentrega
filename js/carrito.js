
// Función para abrir/cerrar el carrito
function toggleCarrito() {
  const carrito = document.getElementById('carrito-sidebar');
  const overlay = document.getElementById('overlay');
  carrito.classList.toggle('open');
  overlay.classList.toggle('active');
}

async function renderCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
  const carritoItems = document.getElementById('carrito-items');
  const carritoTotal = document.getElementById('carrito-total');
  const carritoCantidad = document.getElementById('carrito-cantidad');
  
  let total = 0;
  let cantidad = 0;
  
  carritoItems.innerHTML = '';
  
  if (Object.keys(carrito).length === 0) {
    carritoItems.innerHTML = '<div class="carrito-vacio">El carrito está vacío</div>';
    carritoTotal.textContent = '$0';
    carritoCantidad.textContent = '0';
    carritoCantidad.style.display = 'none';
    
    // Ocultar botón de pagar si el carrito está vacío
    const pagarBtn = document.getElementById('pagar-btn');
    if (pagarBtn) pagarBtn.style.display = 'none';
    
    return;
  }
  
  carritoCantidad.style.display = 'flex';
  
  // Mostrar botón de pagar
  const pagarBtn = document.getElementById('pagar-btn');
  if (pagarBtn) pagarBtn.style.display = 'block';
  
  // Cargar todos los productos si no están cargados
  if (!window.todosLosProductos || window.todosLosProductos.length === 0) {
    const res = await fetch('https://api.jsonbin.io/v3/b/68847e1dae596e708fbbf4a6/latest');
    const data = await res.json();
    window.todosLosProductos = data.record;
  }
  
  // Renderizar items
  for (const [id, item] of Object.entries(carrito)) {
    const itemElement = document.createElement('div');
    itemElement.className = 'carrito-item';
    
    const img = document.createElement('img');
    img.src = await getProductImage(id);
    img.alt = item.title;
    img.onerror = function() {
      this.src = '../media/img/placeholder.jpg';
    };
    
    itemElement.appendChild(img);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'carrito-item-info';
    infoDiv.innerHTML = `
      <div class="carrito-item-title">${item.title}</div>
      <div class="carrito-item-price">$${item.price} x ${item.cantidad}</div>
    `;
    
    itemElement.appendChild(infoDiv);
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'carrito-item-remove';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.onclick = () => removeFromCart(id);
    
    itemElement.appendChild(removeBtn);
    carritoItems.appendChild(itemElement);
    
    total += item.price * item.cantidad;
    cantidad += item.cantidad;
  }
  
  carritoTotal.textContent = `$${total.toFixed(2)}`;
  carritoCantidad.textContent = cantidad;
}

// Función para procesar el pago
function procesarPago() {
  // Mostrar mensaje de agradecimiento
  const carritoItems = document.getElementById('carrito-items');
  carritoItems.innerHTML = `
    <div class="mensaje-compra">
      <i class="fas fa-check-circle"></i>
      <h3>¡Gracias por su compra!</h3>
      <p>Su pedido ha sido procesado con éxito.</p>
    </div>
  `;
  
  // Ocultar botón de pagar y total temporalmente
  const pagarBtn = document.getElementById('pagar-btn');
  const carritoTotal = document.getElementById('carrito-total');
  if (pagarBtn) pagarBtn.style.display = 'none';
  if (carritoTotal) carritoTotal.style.display = 'none';
  
  // Vaciar el carrito
  localStorage.removeItem('carrito');
  
  // Actualizar contador
  updateCartCounter();
  
  // Después de 2 segundos, volver a mostrar el carrito vacío
  setTimeout(() => {
    renderCarrito();
    if (carritoTotal) carritoTotal.style.display = 'block';
  }, 2000);
}

// Función para eliminar un item del carrito
function removeFromCart(id) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
  delete carrito[id];
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCarrito();
  
  // Actualizar contador en el icono
  updateCartCounter();
}

// Función mejorada para obtener imágenes desde la API
async function getProductImage(id) {
  try {
    // Si ya tenemos los productos cargados
    if (window.todosLosProductos && window.todosLosProductos.length > 0) {
      const producto = window.todosLosProductos.find(p => p.id === parseInt(id));
      return producto?.image || '../media/img/placeholder.jpg';
    }
    
    // Si no, hacer fetch del producto específico
    const res = await fetch(`https://api.jsonbin.io/v3/b/68847e1dae596e708fbbf4a6/latest`);
    const data = await res.json();
    const producto = data.record.find(p => p.id === parseInt(id));
    
    return producto?.image || '../media/img/placeholder.jpg';
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    return '../media/img/placeholder.jpg';
  }
}

// Función para actualizar el contador del carrito
function updateCartCounter() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
  const carritoCantidad = document.getElementById('carrito-cantidad');
  const totalItems = Object.values(carrito).reduce((sum, item) => sum + item.cantidad, 0);
  
  if (totalItems > 0) {
    carritoCantidad.textContent = totalItems;
    carritoCantidad.style.display = 'flex';
  } else {
    carritoCantidad.style.display = 'none';
  }
}

// Animación al agregar al carrito
function animateCartButton(button) {
  button.classList.add('item-added-animation');
  setTimeout(() => {
    button.classList.remove('item-added-animation');
  }, 500);
}

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Crear elementos del carrito si no existen
  if (!document.getElementById('carrito-sidebar')) {
    const carritoHTML = `
      <div class="overlay" id="overlay" onclick="toggleCarrito()"></div>
      <div class="carrito-sidebar" id="carrito-sidebar">
        <div class="carrito-header">
          <h3>Tu Carrito</h3>
          <button class="close-carrito" onclick="toggleCarrito()"><i class="fas fa-times"></i></button>
        </div>
        <div class="carrito-items" id="carrito-items"></div>
        <div class="carrito-total">Total: <span id="carrito-total">$0</span></div>
        <button id="pagar-btn" class="pagar-btn">Pagar</button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', carritoHTML);
    
    // Agregar evento al botón de pagar
    document.getElementById('pagar-btn').addEventListener('click', procesarPago);
    
    // Actualizar el icono del carrito
    const carritoIcon = document.querySelector('.fa-shopping-cart').parentNode;
    carritoIcon.innerHTML = `
      <div class="carrito-icon-container">
        <i class="fas fa-shopping-cart"></i>
        <div class="carrito-cantidad" id="carrito-cantidad" style="display: none;">0</div>
      </div>
    `;
    carritoIcon.onclick = function(e) {
      e.preventDefault();
      toggleCarrito();
    };
  }
  
  // Renderizar carrito inicial
  renderCarrito();
  updateCartCounter();
});

async function agregarAlCarrito(id, title, price) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
  carrito[id] = carrito[id] ? { ...carrito[id], cantidad: carrito[id].cantidad + 1 } : { title, price, cantidad: 1 };
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Animación
  animateCartButton(event.target);
  
  // Actualizar carrito
  await renderCarrito();
  updateCartCounter();
  
  // Notificación
  showNotification('¡Producto agregado!');
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}