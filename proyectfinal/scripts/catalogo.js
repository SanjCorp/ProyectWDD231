// catalog.js
const catalogGrid = document.getElementById('catalog-grid');
const filterSelect = document.getElementById('filter');

let products = [];

// Load JSON and display catalog
async function loadProducts() {
  try {
    const res = await fetch('data/projects.json'); // adjust path if necessary
    products = await res.json();
    displayProducts(products);
    loadCategories(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Create the HTML card for a product
function createCard(product) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}" loading="lazy" width="300" height="200">
    <h4>${product.name}</h4>
    <p><em>${product.category} · ${product.controller}</em></p>
    <p>${product.description.substring(0, 70)}...</p>
    <p><strong>${product.price > 0 ? '$' + product.price : 'On request'}</strong></p>
  `;
  return div;
}

// Display products in the grid
function displayProducts(list) {
  catalogGrid.innerHTML = '';
  if (list.length === 0) {
    catalogGrid.innerHTML = '<p>No products to display.</p>';
    return;
  }
  list.forEach(p => {
    catalogGrid.appendChild(createCard(p));
  });
}

// Populate unique category filter
function loadCategories(list) {
  const categories = Array.from(new Set(list.map(p => p.category))).sort();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filterSelect.appendChild(option);
  });
}

// Filter category event
filterSelect.addEventListener('change', () => {
  if (filterSelect.value === 'all') {
    displayProducts(products);
  } else {
    displayProducts(products.filter(p => p.category === filterSelect.value));
  }
});

// Initialization
document.addEventListener('DOMContentLoaded', loadProducts);
