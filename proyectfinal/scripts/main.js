import { loadProducts } from './catalogo.js';

document.addEventListener('DOMContentLoaded', async () => {
  // hamburger
  const hamb = document.querySelector('.hamburger');
  hamb.addEventListener('click', () => {
    const nav = document.getElementById('site-nav');
    const expanded = hamb.getAttribute('aria-expanded') === 'true';
    hamb.setAttribute('aria-expanded', String(!expanded));
    if (nav.querySelector('ul')) nav.querySelector('ul').style.display = expanded ? 'none' : 'flex';
  });

  try {
    const products = await loadProducts();
    // Featured: show first 4
    const featured = products.slice(0, 4);
    const grid = document.getElementById('featured-grid');
    featured.forEach(p => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <img loading="lazy" src="${p.imagen}" alt="${p.nombre}">
        <h4>${p.nombre}</h4>
        <p style="color:var(--muted)">${p.categoria} · ${p.controlador}</p>
        <p><strong>${p.precio > 0 ? ('$' + p.precio) : 'Order'}</strong></p>
        <button class="btn" data-id="${p.id}">View</button>
      `;
      grid.appendChild(div);
    });

    // favorites
    const favsDiv = document.getElementById('favorites');
    const favs = JSON.parse(localStorage.getItem('favs') || '[]');
    favs.forEach(id => {
      const p = products.find(x => x.id === id);
      if (!p) return;
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `<img loading="lazy" src="${p.imagen}" alt="${p.nombre}"><h4>${p.nombre}</h4><p><strong>${p.precio > 0 ? ('$' + p.precio) : 'Order'}</strong></p>`;
      favsDiv.appendChild(div);
    });

    // Add event delegation for "View" buttons to open modal via catalogo module
    document.body.addEventListener('click', e => {
      if (e.target.matches('button[data-id]')) {
        const id = Number(e.target.getAttribute('data-id'));
        const prod = products.find(p => p.id === id);
        if (window.openProductModal) window.openProductModal(prod);
      }
    });
  } catch (err) {
    console.error('Error loading featured products', err);
    const grid = document.getElementById('featured-grid');
    grid.innerHTML = '<p style="color:var(--muted)">Could not load products.</p>';
  }
});
