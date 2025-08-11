/* form.js - handle prefilling from product param and localStorage example */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('solicitud');
  const params = new URLSearchParams(location.search);
  const product = params.get('producto');
  if (product) {
    const msg = document.getElementById('mensaje');
    if (msg) msg.value = `I request information and a quote for: ${product}\n`;
  }

  form.addEventListener('submit', (e) => {
    // simple client-side validation demonstration
    if (!form.checkValidity()) {
      e.preventDefault();
      alert('Please fill in the required fields.');
      return;
    }
    // Save last request in localStorage (requirement: local storage usage)
    const last = {
      name: form.nombre.value,
      email: form.email.value,
      type: form.tipo.value,
      message: form.mensaje.value,
      date: new Date().toISOString()
    };
    localStorage.setItem('lastRequest', JSON.stringify(last));
    // allow normal submit to form-action.html (GET)
  });
});
