// catalogo.js
const catalogoGrid = document.getElementById('catalogo-grid');
const filterSelect = document.getElementById('filter');

let productos = [];

// Carga JSON y muestra catálogo
async function cargarProductos() {
  try {
    const res = await fetch('data/proyectos.json'); // ajusta ruta si es necesario
    productos = await res.json();
    mostrarProductos(productos);
    cargarCategorias(productos);
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

// Crea la tarjeta HTML para un producto
function crearTarjeta(producto) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" width="300" height="200">
    <h4>${producto.nombre}</h4>
    <p><em>${producto.categoria} · ${producto.controlador}</em></p>
    <p>${producto.descripcion.substring(0, 70)}...</p>
    <p><strong>${producto.precio > 0 ? '$' + producto.precio : 'Pedido'}</strong></p>
  `;
  return div;
}

// Muestra productos en el grid
function mostrarProductos(lista) {
  catalogoGrid.innerHTML = '';
  if(lista.length === 0) {
    catalogoGrid.innerHTML = '<p>No hay productos que mostrar.</p>';
    return;
  }
  lista.forEach(p => {
    catalogoGrid.appendChild(crearTarjeta(p));
  });
}

// Llena filtro de categorías único
function cargarCategorias(lista) {
  const categorias = Array.from(new Set(lista.map(p => p.categoria))).sort();
  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filterSelect.appendChild(option);
  });
}

// Evento filtro categoría
filterSelect.addEventListener('change', () => {
  if(filterSelect.value === 'all') {
    mostrarProductos(productos);
  } else {
    mostrarProductos(productos.filter(p => p.categoria === filterSelect.value));
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', cargarProductos);
