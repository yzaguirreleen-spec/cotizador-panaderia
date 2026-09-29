/**
 * Cotizador de Pedidos - Panadería Artesanal Trigal de Lima
 * resumen.js
 * 
 * Cumple con el Punto 09:
 * - Recupera el pedido almacenado en sessionStorage.
 * - Trata la apertura directa sin datos mostrando un panel de aviso.
 * - Renderiza la tabla de productos elegidos y el desglose de importes.
 * - Permite modificar el pedido regresando a pedido.html o confirmar definitivamente.
 */

document.addEventListener('DOMContentLoaded', () => {

  const seccionSinDatos = document.getElementById('seccionSinDatos');
  const seccionConDatos = document.getElementById('seccionConDatos');

  const detalleNombre = document.getElementById('detalleNombre');
  const detalleCorreo = document.getElementById('detalleCorreo');
  const detalleFecha = document.getElementById('detalleFecha');
  const detalleModalidad = document.getElementById('detalleModalidad');

  const tablaCuerpoProductos = document.getElementById('tablaCuerpoProductos');

  const montoSubtotal = document.getElementById('montoSubtotal');
  const detalleFilaDescuento = document.getElementById('detalleFilaDescuento');
  const montoDescuento = document.getElementById('montoDescuento');
  const montoReparto = document.getElementById('montoReparto');
  const textoTipoModalidad = document.getElementById('textoTipoModalidad');
  const montoTotal = document.getElementById('montoTotal');

  const btnModificar = document.getElementById('btnModificar');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const grupoBotonesAccion = document.getElementById('grupoBotonesAccion');
  const alertaConfirmado = document.getElementById('alertaConfirmado');
  const numCotizacion = document.getElementById('numCotizacion');

  // Punto 09: Recuperar datos desde sessionStorage
  const datosGuardados = sessionStorage.getItem('pedidoPanaderia');

  // Validación de apertura directa sin datos
  if (!datosGuardados) {
    mostrarPantallaSinDatos();
    return;
  }

  let pedido;
  try {
    pedido = JSON.parse(datosGuardados);
  } catch (e) {
    console.error('Error al procesar JSON de sessionStorage:', e);
    mostrarPantallaSinDatos();
    return;
  }

  // Verificar que la estructura del pedido sea válida
  if (!pedido || !pedido.cliente || !Array.isArray(pedido.productos) || pedido.productos.length === 0 || !pedido.montos) {
    mostrarPantallaSinDatos();
    return;
  }

  // Mostrar sección con datos válidos
  mostrarPantallaConDatos();

  function mostrarPantallaSinDatos() {
    seccionSinDatos.classList.remove('d-none');
    seccionConDatos.classList.add('d-none');
  }

  function mostrarPantallaConDatos() {
    seccionSinDatos.classList.add('d-none');
    seccionConDatos.classList.remove('d-none');
  }

  /**
   * Formatear fecha a formato amigable
   */
  function formatearFecha(fechaStr) {
    try {
      const partes = fechaStr.split('-');
      if (partes.length === 3) {
        const [anio, mes, dia] = partes;
        const fechaObj = new Date(anio, mes - 1, dia);
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fechaObj.toLocaleDateString('es-PE', opciones);
        return `${fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)} (${fechaStr})`;
      }
    } catch (e) {
      console.warn('Error al formatear fecha:', e);
    }
    return fechaStr;
  }

  // 1. Mostrar información del cliente
  detalleNombre.textContent = pedido.cliente.nombre;
  detalleCorreo.textContent = pedido.cliente.correo;
  detalleFecha.textContent = formatearFecha(pedido.cliente.fecha);

  if (pedido.cliente.modalidad === 'reparto') {
    detalleModalidad.textContent = 'Reparto a Domicilio';
    detalleModalidad.className = 'badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fs-6';
    textoTipoModalidad.textContent = 'Reparto a domicilio';
  } else {
    detalleModalidad.textContent = 'Retiro en Tienda';
    detalleModalidad.className = 'badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-6';
    textoTipoModalidad.textContent = 'Retiro en tienda';
  }

  // 2. Renderizar tabla de productos con un bucle
  tablaCuerpoProductos.innerHTML = '';

  for (let i = 0; i < pedido.productos.length; i++) {
    const item = pedido.productos[i];
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td class="text-start">
        <strong>${item.nombre}</strong>
      </td>
      <td class="text-center">S/ ${item.precio.toFixed(2)}</td>
      <td class="text-center">
        <span class="badge bg-secondary rounded-pill px-2">${item.cantidad}</span>
      </td>
      <td class="text-end fw-bold text-secondary">S/ ${item.subtotal.toFixed(2)}</td>
    `;

    tablaCuerpoProductos.appendChild(fila);
  }

  // 3. Renderizar importes calculados
  montoSubtotal.textContent = `S/ ${pedido.montos.subtotal.toFixed(2)}`;

  if (pedido.montos.descuento > 0) {
    detalleFilaDescuento.classList.remove('d-none');
    montoDescuento.textContent = `- S/ ${pedido.montos.descuento.toFixed(2)}`;
  } else {
    detalleFilaDescuento.classList.add('d-none');
    montoDescuento.textContent = 'S/ 0.00';
  }

  montoReparto.textContent = `S/ ${pedido.montos.reparto.toFixed(2)}`;
  montoTotal.textContent = `S/ ${pedido.montos.total.toFixed(2)}`;

  // 4. Botón Modificar: Regresar al formulario conservando datos en sessionStorage
  btnModificar.addEventListener('click', () => {
    window.location.href = 'pedido.html';
  });

  // 5. Botón Confirmar: Simular confirmación exitosa
  btnConfirmar.addEventListener('click', () => {
    grupoBotonesAccion.classList.add('d-none');
    
    // Generar código aleatorio de cotización
    const codigoAleatorio = Math.floor(1000 + Math.random() * 9000);
    numCotizacion.textContent = codigoAleatorio;

    alertaConfirmado.classList.remove('d-none');

    // Limpiar sessionStorage tras confirmación definitiva
    sessionStorage.removeItem('pedidoPanaderia');
  });

});
