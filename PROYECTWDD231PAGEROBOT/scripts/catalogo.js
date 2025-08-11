
/* catalogo.js - ES module */
export async function loadProducts(){
  try{
    const res = await fetch('data/proyectos.json');
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    // ensure at least 15 items (requirement)
    if(data.length < 15) console.warn('Se esperan 15 o más items');
    return data;
  }catch(err){
    console.error('Fetch error', err);
    throw err;
  }
}

function createCard(p){
  const div = document.createElement('div');
  div.className='card';
  div.innerHTML = `
    <img loading="lazy" src="${p.imagen}" alt="${p.nombre}">
    <h4>${p.nombre}</h4>
    <p style="color:var(--muted)">${p.categoria} · ${p.controlador}</p>
    <p>${p.descripcion.slice(0,70)}...</p>
    <p><strong>${p.precio>0?('$'+p.precio):'Pedido'}</strong></p>
    <div style="display:flex;gap:.5rem;margin-top:.5rem">
      <button class="btn" data-id="${p.id}">Ver más</button>
      <button class="filter add-fav" data-id="${p.id}" aria-label="Agregar a favoritos">♡</button>
    </div>
  `;
  return div;
}

function openModal(p){
  const backdrop = document.getElementById('modal-backdrop');
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <h3>${p.nombre}</h3>
    <img src="${p.imagen}" alt="${p.nombre}" style="width:100%;height:220px;object-fit:cover;border-radius:8px">
    <p><strong>Precio:</strong> ${p.precio>0?('$'+p.precio):'Pedido'}</p>
    <p><strong>Controlador:</strong> ${p.controlador}</p>
    <p>${p.descripcion}</p>
    <p><strong>Categoría:</strong> ${p.categoria}</p>
    <button id="to-request" class="btn">Solicitar/Comprar</button>
  `;
  backdrop.style.display='flex';
  backdrop.setAttribute('aria-hidden','false');
  // focus handling
  document.getElementById('modal-close').focus();
  // bind inside button
  document.getElementById('to-request').addEventListener('click', ()=>{
    // redirect to contact form with product info
    location.href = `contacto.html?producto=${encodeURIComponent(p.nombre)}`;
  });
}

export function openProductModal(p){ openModal(p); }

export default async function initCatalog(){
  const products = await loadProducts();
  const grid = document.getElementById('catalogo-grid');
  const filter = document.getElementById('filter');
  const categories = Array.from(new Set(products.map(p=>p.categoria)));
  categories.forEach(cat=>{
    const o = document.createElement('option'); o.value=cat; o.textContent=cat; filter.appendChild(o);
  });
  // render all
  function render(list){
    grid.innerHTML='';
    list.forEach(p=> grid.appendChild(createCard(p)));
  }
  render(products);

  // event listeners
  document.body.addEventListener('click', e=>{
    if(e.target.matches('button[data-id]')){
      const id = Number(e.target.getAttribute('data-id'));
      const prod = products.find(x=>x.id===id);
      openModal(prod);
    }else if(e.target.matches('.add-fav')){
      const id = Number(e.target.getAttribute('data-id'));
      const favs = JSON.parse(localStorage.getItem('favs')||'[]');
      if(!favs.includes(id)) favs.push(id);
      localStorage.setItem('favs', JSON.stringify(favs));
      alert('Agregado a favoritos');
    }
  });

  document.getElementById('modal-close').addEventListener('click', ()=>{
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.style.display='none';
    backdrop.setAttribute('aria-hidden','true');
  });

  filter.addEventListener('change', ()=>{
    const v = filter.value;
    if(v==='all') render(products);
    else render(products.filter(p=>p.categoria===v));
  });

  document.getElementById('clear-favs').addEventListener('click', ()=>{
    localStorage.removeItem('favs');
    alert('Favoritos borrados');
  });

  // expose for other modules
  window.openProductModal = openModal;
}
