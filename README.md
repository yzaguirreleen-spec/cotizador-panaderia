# Caso 2: Cotizador de Pedidos de Panadería Artesanal "Trigal de Lima"

Aplicativo web para cotizar presupuestos de pedidos en línea, desarrollado con **HTML5**, **Bootstrap 5.3**, **CSS3** y **JavaScript (ES6)**. Implementa validaciones en tiempo real, catálogo dinámico generado con bucles, cálculos con condicionales explícitas y persistencia entre páginas mediante `sessionStorage`.

---

## 📁 Estructura del Proyecto

```text
cotizador-panaderia/
│
├── index.html            # Redirección automática al cotizador
├── pedido.html           # Formulario principal de cotización (Puntos 06, 07 y 08)
├── resumen-pedido.html   # Pantalla de confirmación y resumen (Punto 09)
├── styles.css            # Estilos personalizados y tema de panadería
├── pedido.js             # Lógica del catálogo, validaciones y cálculos
├── resumen.js            # Lectura de sessionStorage y desglose final
└── README.md             # Documentación del proyecto y casos de prueba
```

---

## 📋 Reglas de Negocio Implementadas

1. **Catálogo de Productos:**
   - Pan de masa madre: **S/ 18.00**
   - Caja de alfajores: **S/ 24.00**
   - Torta pequeña: **S/ 45.00**
2. **Cantidades:** Entre **1 y 10** unidades enteras por producto seleccionado. Se debe elegir **al menos un producto**.
3. **Modalidad de Entrega:**
   - Retiro en tienda: **S/ 0.00**
   - Reparto a domicilio: **+ S/ 8.00**
4. **Descuento:** Si el subtotal de productos llega a **S/ 100.00** o más, se aplica un **10 % de descuento** al subtotal antes de sumar el costo de reparto.
5. **Validaciones de Cliente:**
   - Nombre de **3 a 60 caracteres**.
   - Correo electrónico con formato válido.
   - Fecha de entrega **no anterior a la fecha actual**.

---

## 🧪 Casos de Prueba y Documentación (Punto 10)

| Caso de Prueba | Entrada / Acción | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **1. Pedido sin producto** | Completar datos del cliente y dejar todos los productos desmarcados. Clic en *Generar Resumen*. | Alerta roja: `"Debe seleccionar al menos un producto del catálogo."`. No permite avanzar. | Mensaje visible en pantalla, el formulario detiene el envío. | **APROBADO** |
| **2. Cantidad 0 o decimal** | Seleccionar *Pan de masa madre* e ingresar cantidad `0` o `2.5`. | Campo se resalta en rojo. Alerta: `"La cantidad para 'Pan de masa madre' debe ser un número entero entre 1 y 10."`. | Bloqueo inmediato en validación y cálculo. | **APROBADO** |
| **3. Pedido con Descuento y Reparto** *(Caso oficial)* | • 2 Tortas pequeñas (2 × S/ 45 = S/ 90)<br>• 1 Caja de alfajores (1 × S/ 24 = S/ 24)<br>• Modalidad: *Reparto a domicilio* | • **Subtotal:** S/ 114.00<br>• **Descuento (10%):** S/ 11.40<br>• **Reparto:** S/ 8.00<br>• **Total:** S/ 110.60 | **Subtotal:** S/ 114.00<br>**Descuento:** -S/ 11.40<br>**Reparto:** S/ 8.00<br>**Total:** S/ 110.60 | **APROBADO** |
| **4. Apertura directa sin datos** | Abrir `resumen-pedido.html` directamente en el navegador sin llenar el formulario. | Mostrar tarjeta roja de advertencia: *"Acceso directo detectado"* con botón para ir al cotizador. | Pantalla de bloqueo mostrada correctamente, impidiendo errores de JS. | **APROBADO** |

---

## 🚀 Despliegue en GitHub Pages

1. Subir todos los archivos a un repositorio en GitHub (ej. `cotizador-panaderia`).
2. Ir a **Settings > Pages** y elegir la rama `main` en `/ (root)`.
3. Al tener `index.html` en la raíz, la página cargará directamente en:
   `https://[tu-usuario].github.io/[nombre-repositorio]/`
