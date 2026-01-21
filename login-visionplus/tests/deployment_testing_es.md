# Guía de Pruebas en Despliegue (Production Testing)

Esta guía está diseñada para validar tu aplicación **ya desplegada en producción**, con un enfoque especial en diagnosticar el comportamiento de la pasarela de pagos.

## 1. Sanity Check (Pruebas de Salud Básicas)

Antes de profundizar, verifica que lo básico funcione:

1.  **Acceso Seguro (SSL)**:
    -   Entra a `https://tu-dominio.com`.
    -   Verifica que aparezca el candado 🔒 al lado de la URL.
    -   *Importante*: Si entras con `http://` (sin S), ¿te redirige automáticamente a `https://`?

2.  **Carga de Recursos**:
    -   Abre la consola del navegador (`F12` -> Pestaña `Console`).
    -   Recarga la página.
    -   **Verificación**: No deberían aparecer errores rojos de `404 Not Found` para archivos `.js`, `.css` o imágenes.

## 2. Diagnóstico de la Falla en Pagos

Sabemos que la pasarela de pagos no abre, pero debemos confirmar **por qué** y asegurar que la UI no se rompa de mala manera.

### Paso A: Validación del Formulario
Aunque el pago no funcione, el formulario **debe validar** tus datos antes de intentar cobrar.

1.  Ve a la página de selección de plan y pago.
2.  **Prueba de Vacíos**: Intenta hacer clic en "Pagar" sin llenar nada.
    -   *Resultado esperado*: Mensajes de "Campo requerido" en rojo. La página NO debe recargar ni hacer nada.
3.  **Prueba de Formato**:
    -   Pon un número de tarjeta corto (ej. "123").
    -   Pon una fecha expirada.
    -   *Resultado esperado*: El sistema debe decir "Tarjeta inválida" o similar.

### Paso B: Capturando el Error de la Pasarela (La prueba más importante)
Sigue esto para saber exactamente qué falla al conectar con el proveedor de pagos:

1.  Abre las **Herramientas de Desarrollador** (`F12` o Clic derecho -> Inspeccionar).
2.  Ve a la pestaña **Network** (Red).
3.  Liena el formulario con datos "válidos" de prueba (aunque sean falsos, que cumplan el formato).
4.  Haz clic en **"Pagar"** (o el botón de confirmación).
5.  Mira la lista de peticiones en **Network**:
    -   Busca una petición que esté en **Rojo** (probablemente a tu backend `/api/pay` o a la URL de Stripe/PayPal).
    -   Haz clic en esa petición roja.
    -   Ve a la sub-pestaña **Response** (Respuesta).
    -   **¿Qué dice ahí?**
        -   *Posibilidad 1*: `500 Internal Server Error` -> El backend falló (tal vez faltan variables de entorno `STRIPE_KEY` en el servidor).
        -   *Posibilidad 2*: `400 Bad Request` -> Enviamos mal los datos.
        -   *Posibilidad 3*: `CORS Error` (en la Consola) -> El dominio del frontend no está autorizado en el backend.

## 3. Verificación de Rutas Protegidas

1.  **Sin Login**: Intenta entrar directo a `/dashboard` o `/perfil`.
    -   *Resultado*: Debe redirigirte al `/login`.
2.  **Cookie Segura**:
    -   Loguéate.
    -   En `F12` -> Pestaña **Application** -> Cookies.
    -   Verifica que tu cookie de sesión tenga los flags `Secure` y `SameSite` activados (esto es vital en producción HTTPS).

## Resumen para tu Reporte
Si alguien te pregunta "¿Qué pasa con los pagos?", con esta prueba podrás decir con precisión:
> *"La validación del formulario funciona correctamente en el frontend, pero al enviar la solicitud, el servidor responde con un error [X] indicando que falta la integración con la pasarela."*
