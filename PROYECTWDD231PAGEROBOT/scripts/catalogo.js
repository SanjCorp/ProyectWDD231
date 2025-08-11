// scripts/catalogo.js

document.addEventListener('DOMContentLoaded', () => {
    const catalogoContainer = document.querySelector('#catalogo-container');
    const loader = document.createElement('p');
    loader.textContent = 'Cargando proyectos...';
    catalogoContainer.appendChild(loader);

    // Usar ruta relativa robusta para GitHub Pages
    fetch('./data/proyectos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            catalogoContainer.innerHTML = ''; // limpiar loader
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    const card = document.createElement('div');
                    card.classList.add('proyecto-card');

                    card.innerHTML = `
                        <img src="${item.imagen}" alt="${item.nombre}" loading="lazy">
                        <h3>${item.nombre}</h3>
                        <p>${item.descripcion}</p>
                        <p><strong>Precio:</strong> $${item.precio}</p>
                    `;
                    catalogoContainer.appendChild(card);
                });
            } else {
                catalogoContainer.innerHTML = '<p>No hay proyectos para mostrar.</p>';
            }
        })
        .catch(error => {
            console.error('Error cargando los proyectos:', error);
            catalogoContainer.innerHTML = `
                <p style="color:red;">
                    No se pudieron cargar los proyectos.<br>
                    Verifica que el archivo <code>data/proyectos.json</code> esté en la carpeta correcta y en GitHub Pages.
                </p>
            `;
        });
});
