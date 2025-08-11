
/* form.js - handle prefilling from product param and localStorage example */
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('solicitud');
  const params = new URLSearchParams(location.search);
  const producto = params.get('producto');
  if(producto){
    const msg = document.getElementById('mensaje');
    if(msg) msg.value = `Solicito información y cotización para: ${producto}\n`;
  }

  form.addEventListener('submit', (e)=>{
    // simple client-side validation demonstration
    if(!form.checkValidity()){
      e.preventDefault();
      alert('Por favor rellena los campos requeridos.');
      return;
    }
    // Save last request in localStorage (requirement: local storage usage)
    const last = {nombre: form.nombre.value, email: form.email.value, tipo: form.tipo.value, mensaje: form.mensaje.value, fecha: new Date().toISOString()};
    localStorage.setItem('lastRequest', JSON.stringify(last));
    // allow normal submit to form-action.html (GET)
  });
});
