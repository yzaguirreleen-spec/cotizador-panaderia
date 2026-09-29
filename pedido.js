/**
 * Cotizador de Pedidos - Panadería Artesanal Trigal de Lima
 * pedido.js
 * 
 * Cumple con los puntos 06, 07 y 08:
 * - Catálogo como arreglo de objetos y renderizado con bucle.
 * - Validación de cliente, fecha, productos y cantidades enteras (1 - 10).
 * - Cálculos con condicionales explícitas: subtotal, descuento (10% si subtotal >= 100), reparto (S/ 8 o S/ 0) y total.
 * - Resumen interactivo en tiempo real y almacenamiento en sessionStorage.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Punto 07: Modelado del catálogo como arreglo de objetos
  const CATALOGO = [
    {
      id: 'pan',
      nombre: 'Pan de masa madre',
      precio: 18.00,
      descripcion: 'Hogaza de 750g con fermentación natural de masa madre viva.'
    },
    {
      id: 'alfajores',
      nombre: 'Caja de alfajores',
      precio: 24.00,
      descripcion: 'Caja artesanal de 12 unidades con abundante manjar blanco.'
    },
    {
      id: 'torta',
      nombre: 'Torta pequeña',
      precio: 45.00,
      descripcion: 'Torta artesanal para 4 a 6 porciones con cobertura tradicional.'
    }
  ];

  // Referencias a elementos del DOM
  const formPedido = document.getElementById('formPedido');
  const inputNombre = document.getElementById('nombre');
  const inputCorreo = document.getElementById('correo');
  const inputFecha = document.getElementById('fecha');
  const contenedorProductos = document.getElementById('contenedorProductos');
  const feedbackProductos = document.getElementById('feedback-productos');
  const textoErrorProductos = document.getElementById('textoErrorProductos');
  const alertaEdicion = document.getElementById('alertaEdicion');

  // Elementos del resumen en vivo
  const resumenSubtotal = document.getElementById('resumenSubtotal');
  const filaDescuento = document.getElementById('filaDescuento');
  const resumenDescuento = document.getElementById('resumenDescuento');
  const resumenReparto = document.getElementById('resumenReparto');
  const resumenTotal = document.getElementById('resumenTotal');

  // Configuración de la fecha mínima de entrega (hoy)
  function establecerFechaMinima() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaActualISO = `${anio}-${mes}-${dia}`;
    inputFecha.min = fechaActualISO;
    return fechaActualISO;
  }
  const fechaHoy = establecerFechaMinima();

  /**
   * Punto 07: Generación de las filas del catálogo mediante un bucle
   */
  function renderizarCatalogo() {
    contenedorProductos.innerHTML = '';

    for (let i = 0; i < CATALOGO.length; i++) {
      const prod = CATALOGO[i];

      const divFila = document.createElement('div');
      divFila.className = 'product-row';
      divFila.id = `fila-${prod.id}`;

      divFila.innerHTML = `
        <div class="row align-items-center g-2">
          <!-- Checkbox y Nombre -->
          <div class="col-12 col-sm-6 col-md-5">
            <div class="form-check">
              <input 
                class="form-check-input check-producto" 
                type="checkbox" 
                id="check-${prod.id}" 
                data-id="${prod.id}"
                data-nombre="${prod.nombre}"
                data-precio="${prod.precio}"
              >
              <label class="form-check-label fw-bold" for="check-${prod.id}">
                ${prod.nombre}
              </label>
            </div>
            <div class="text-muted small ps-4">${prod.descripcion}</div>
          </div>

          <!-- Precio Unitario -->
          <div class="col-6 col-sm-3 col-md-2 text-sm-center">
            <span class="badge-price">S/ ${prod.precio.toFixed(2)}</span>
          </div>

          <!-- Cantidad (1 a 10) -->
          <div class="col-6 col-sm-3 col-md-3">
            <label for="cant-${prod.id}" class="visually-hidden">Cantidad para ${prod.nombre}</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text">Cant.</span>
              <input 
                type="number" 
                class="form-control text-center input-cantidad" 
                id="cant-${prod.id}" 
                data-id="${prod.id}"
                value="1" 
                min="1" 
                max="10" 
                step="1"
                disabled
              >
            </div>
            <div class="invalid-feedback small" id="err-cant-${prod.id}">
              Entre 1 y 10.
            </div>
          </div>

          <!-- Subtotal por producto -->
          <div class="col-12 col-md-2 text-end text-sm-end text-md-end mt-1 mt-md-0">
            <span class="small text-muted d-md-none">Subtotal: </span>
            <span class="fw-bold text-secondary" id="subtotal-item-${prod.id}">S/ 0.00</span>
          </div>
        </div>
      `;

      contenedorProductos.appendChild(divFila);
    }
  }

  renderizarCatalogo();

  /**
   * Punto 07: Función para leer y validar los productos elegidos
   */
  function leerProductosElegidos() {
    const checks = document.querySelectorAll('.check-producto');
    const seleccionados = [];
    let hayErrorCantidad = false;
    let mensajeError = '';

    checks.forEach((chk) => {
      if (chk.checked) {
        const prodId = chk.dataset.id;
        const nombre = chk.dataset.nombre;
        const precio = parseFloat(chk.dataset.precio);
        const inputCant = document.getElementById(`cant-${prodId}`);
        const valorTexto = inputCant.value.trim();
        const cantidadNum = Number(valorTexto);

        // Validación de cantidad entera entre 1 y 10
        const esEntero = Number.isInteger(cantidadNum);
        const estaEnRango = cantidadNum >= 1 && cantidadNum <= 10;

        if (!esEntero || !estaEnRango || valorTexto === '') {
          hayErrorCantidad = true;
          inputCant.classList.add('is-invalid');
          mensajeError = `La cantidad para "${nombre}" debe ser un número entero entre 1 y 10.`;
        } else {
          inputCant.classList.remove('is-invalid');
          const subtotalItem = precio * cantidadNum;
          seleccionados.push({
            id: prodId,
            nombre: nombre,
            precio: precio,
            cantidad: cantidadNum,
            subtotal: subtotalItem
          });

          // Actualizar subtotal visible en la fila
          const labelSubtotal = document.getElementById(`subtotal-item-${prodId}`);
          if (labelSubtotal) {
            labelSubtotal.textContent = `S/ ${subtotalItem.toFixed(2)}`;
          }
        }
      } else {
        const prodId = chk.dataset.id;
        const inputCant = document.getElementById(`cant-${prodId}`);
        if (inputCant) {
          inputCant.classList.remove('is-invalid');
        }
        const labelSubtotal = document.getElementById(`subtotal-item-${prodId}`);
        if (labelSubtotal) {
          labelSubtotal.textContent = 'S/ 0.00';
        }
      }
    });

    return {
      productos: seleccionados,
      totalSeleccionados: seleccionados.length,
      hayErrorCantidad: hayErrorCantidad,
      mensajeError: mensajeError
    };
  }

  /**
   * Punto 08: Funciones de cálculo con condicionales explícitas
   */

  // 1. Cálculo del subtotal
  function calcularSubtotal(productos) {
    let subtotal = 0;
    for (let i = 0; i < productos.length; i++) {
      subtotal = subtotal + productos[i].subtotal;
    }
    return subtotal;
  }

  // 2. Cálculo del descuento (10% si subtotal >= S/ 100)
  function calcularDescuento(subtotal) {
    let descuento = 0;
    if (subtotal >= 100.00) {
      descuento = subtotal * 0.10;
    } else {
      descuento = 0.00;
    }
    return descuento;
  }

  // 3. Cálculo de reparto (S/ 8 para reparto, S/ 0 para retiro)
  function calcularReparto(modalidad) {
    let costo = 0;
    if (modalidad === 'reparto') {
      costo = 8.00;
    } else {
      costo = 0.00;
    }
    return costo;
  }

  // 4. Cálculo del total final
  function calcularTotal(subtotal, descuento, reparto) {
    const total = (subtotal - descuento) + reparto;
    return total;
  }

  /**
   * Obtiene la modalidad seleccionada
   */
  function obtenerModalidadSeleccionada() {
    const radioReparto = document.getElementById('modalidadReparto');
    if (radioReparto && radioReparto.checked) {
      return 'reparto';
    }
    return 'retiro';
  }

  /**
   * Punto 08: Actualizar el resumen en tiempo real al interactuar con el formulario
   */
  function actualizarResumen() {
    const resultado = leerProductosElegidos();
    const modalidad = obtenerModalidadSeleccionada();

    const subtotal = calcularSubtotal(resultado.productos);
    const descuento = calcularDescuento(subtotal);
    const costoReparto = calcularReparto(modalidad);
    const total = calcularTotal(subtotal, descuento, costoReparto);

    // Renderizar montos formateados a dos decimales
    resumenSubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;

    if (descuento > 0) {
      filaDescuento.classList.remove('d-none');
      resumenDescuento.textContent = `- S/ ${descuento.toFixed(2)}`;
    } else {
      filaDescuento.classList.add('d-none');
      resumenDescuento.textContent = `S/ 0.00`;
    }

    resumenReparto.textContent = `S/ ${costoReparto.toFixed(2)}`;
    resumenTotal.textContent = `S/ ${total.toFixed(2)}`;

    return {
      resultado: resultado,
      subtotal: subtotal,
      descuento: descuento,
      costoReparto: costoReparto,
      total: total,
      modalidad: modalidad
    };
  }

  // Eventos para checkboxes y campos de cantidad
  contenedorProductos.addEventListener('change', (e) => {
    if (e.target.classList.contains('check-producto')) {
      const prodId = e.target.dataset.id;
      const inputCant = document.getElementById(`cant-${prodId}`);
      const fila = document.getElementById(`fila-${prodId}`);

      if (e.target.checked) {
        inputCant.disabled = false;
        fila.classList.add('selected');
        if (!inputCant.value || Number(inputCant.value) < 1) {
          inputCant.value = 1;
        }
      } else {
        inputCant.disabled = true;
        inputCant.classList.remove('is-invalid');
        fila.classList.remove('selected');
      }

      feedbackProductos.classList.add('d-none');
      actualizarResumen();
    }
  });

  contenedorProductos.addEventListener('input', (e) => {
    if (e.target.classList.contains('input-cantidad')) {
      actualizarResumen();
    }
  });

  // Evento al cambiar modalidad de entrega (retiro/reparto)
  const radiosModalidad = document.querySelectorAll('input[name="modalidad"]');
  radiosModalidad.forEach((radio) => {
    radio.addEventListener('change', actualizarResumen);
  });

  /**
   * Validaciones de campos de cliente
   */
  function validarNombre() {
    const valor = inputNombre.value.trim();
    if (valor.length >= 3 && valor.length <= 60) {
      inputNombre.classList.remove('is-invalid');
      inputNombre.classList.add('is-valid');
      return true;
    } else {
      inputNombre.classList.remove('is-valid');
      inputNombre.classList.add('is-invalid');
      return false;
    }
  }

  function validarCorreo() {
    const valor = inputCorreo.value.trim();
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regexEmail.test(valor)) {
      inputCorreo.classList.remove('is-invalid');
      inputCorreo.classList.add('is-valid');
      return true;
    } else {
      inputCorreo.classList.remove('is-valid');
      inputCorreo.classList.add('is-invalid');
      return false;
    }
  }

  function validarFecha() {
    const valor = inputFecha.value;
    if (valor && valor >= fechaHoy) {
      inputFecha.classList.remove('is-invalid');
      inputFecha.classList.add('is-valid');
      return true;
    } else {
      inputFecha.classList.remove('is-valid');
      inputFecha.classList.add('is-invalid');
      return false;
    }
  }

  inputNombre.addEventListener('input', validarNombre);
  inputCorreo.addEventListener('input', validarCorreo);
  inputFecha.addEventListener('change', validarFecha);

  /**
   * Punto 09: Envío de formulario y guardado en sessionStorage
   */
  formPedido.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const fechaValida = validarFecha();

    const calculos = actualizarResumen();
    const { resultado, subtotal, descuento, costoReparto, total, modalidad } = calculos;

    // Validación de productos: Al menos uno seleccionado
    let productosValidos = true;

    if (resultado.totalSeleccionados === 0) {
      feedbackProductos.classList.remove('d-none');
      textoErrorProductos.textContent = 'Debe seleccionar al menos un producto del catálogo.';
      productosValidos = false;
    } else if (resultado.hayErrorCantidad) {
      feedbackProductos.classList.remove('d-none');
      textoErrorProductos.textContent = resultado.mensajeError;
      productosValidos = false;
    } else {
      feedbackProductos.classList.add('d-none');
    }

    if (!nombreValido || !correoValido || !fechaValida || !productosValidos) {
      // Enfocar primer campo con error
      const primerError = formPedido.querySelector('.is-invalid');
      if (primerError) {
        primerError.focus();
      }
      return;
    }

    // Armar objeto completo del pedido según Punto 09
    const pedidoCompleto = {
      cliente: {
        nombre: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        fecha: inputFecha.value,
        modalidad: modalidad
      },
      productos: resultado.productos,
      montos: {
        subtotal: subtotal,
        descuento: descuento,
        reparto: costoReparto,
        total: total
      },
      fechaRegistro: new Date().toLocaleString()
    };

    try {
      sessionStorage.setItem('pedidoPanaderia', JSON.stringify(pedidoCompleto));
      // Redirigir a resumen-pedido.html
      window.location.href = 'resumen-pedido.html';
    } catch (err) {
      console.error('Error al guardar en sessionStorage:', err);
      alert('Ocurrió un error al guardar los datos de su cotización en el navegador.');
    }
  });

  // Restaurar datos si regresa desde el resumen
  function cargarDatosPreviosSiExisten() {
    const datosGuardados = sessionStorage.getItem('pedidoPanaderia');
    if (!datosGuardados) return;

    try {
      const pedido = JSON.parse(datosGuardados);
      if (pedido && pedido.cliente) {
        inputNombre.value = pedido.cliente.nombre || '';
        inputCorreo.value = pedido.cliente.correo || '';
        inputFecha.value = pedido.cliente.fecha || '';

        if (pedido.cliente.modalidad === 'reparto') {
          const radioReparto = document.getElementById('modalidadReparto');
          if (radioReparto) radioReparto.checked = true;
        } else {
          const radioRetiro = document.getElementById('modalidadRetiro');
          if (radioRetiro) radioRetiro.checked = true;
        }

        // Marcar productos previos
        if (Array.isArray(pedido.productos)) {
          pedido.productos.forEach((p) => {
            const chk = document.getElementById(`check-${p.id}`);
            const inputCant = document.getElementById(`cant-${p.id}`);
            const fila = document.getElementById(`fila-${p.id}`);
            if (chk && inputCant && fila) {
              chk.checked = true;
              inputCant.disabled = false;
              inputCant.value = p.cantidad;
              fila.classList.add('selected');
            }
          });
        }

        alertaEdicion.classList.remove('d-none');
        actualizarResumen();
      }
    } catch (e) {
      console.warn('No se pudieron restaurar los datos previos:', e);
    }
  }

  cargarDatosPreviosSiExisten();

  // Reset del formulario
  formPedido.addEventListener('reset', () => {
    setTimeout(() => {
      inputNombre.classList.remove('is-valid', 'is-invalid');
      inputCorreo.classList.remove('is-valid', 'is-invalid');
      inputFecha.classList.remove('is-valid', 'is-invalid');
      feedbackProductos.classList.add('d-none');
      alertaEdicion.classList.add('d-none');

      const filas = document.querySelectorAll('.product-row');
      filas.forEach((f) => f.classList.remove('selected'));

      const inputsCant = document.querySelectorAll('.input-cantidad');
      inputsCant.forEach((inp) => {
        inp.disabled = true;
        inp.value = 1;
        inp.classList.remove('is-invalid');
      });

      actualizarResumen();
    }, 10);
  });

});
