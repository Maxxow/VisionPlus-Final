# Documentación de Pruebas de Frontend

Este documento describe el proceso de pruebas manuales para el frontend de VisionPlus.

## Resumen

Las pruebas de frontend se centran en el Flujo Crítico de Usuario (CUJ): **Registro -> Inicio de Sesión -> Acceso al Dashboard**.

## Configuración
Asegúrate de que el backend esté corriendo y luego inicia el frontend:
```bash
cd login-visionplus/frontend
npm run dev
```
Accede a la aplicación en `http://localhost:5173`.

## Plan de Pruebas: Flujo de Autenticación

### Paso 1: Registro (Camino Feliz)
1.  Navega a la página de Login (`/login`).
2.  Haz clic en "Suscríbete ahora".
3.  Llena el formulario:
    -   **Email**: `usuario_prueba@ejemplo.com`
    -   **Password**: Una robusta (ej. `Pass1234`)
    -   **Nombre**: `Usuario Prueba`
4.  Enviar el formulario.
    -   *Resultado Esperado*: Cuenta creada y redirección al Login o Dashboard.

### Paso 2: Inicio de Sesión
1.  Navega a `/login`.
2.  Ingresa las credenciales creadas en el Paso 1.
3.  Enviar.
    -   *Resultado Esperado*: Autenticación exitosa y acceso al contenido principal.

### Paso 3: Pruebas Negativas (Casos de Error)
Estas pruebas verifican que el sistema maneje los errores correctamente en la interfaz.

1.  **Login Fallido**:
    -   Intenta loguearte con una contraseña incorrecta.
    -   *Resultado*: Debe mostrar un mensaje de error "Credenciales inválidas" o similar.
2.  **Email Inválido**:
    -   Intenta registrarte con un email sin formato (ej. "hola").
    -   *Resultado*: El formulario no debe permitir el envío o mostrar error de validación.
3.  **Campos Vacíos**:
    -   Intenta enviar el formulario de registro vacío.
    -   *Resultado*: Mensajes de "Campo requerido" deben aparecer.

## Verificación Visual

> [!NOTE]
> Estas pruebas se realizaron manualmente.

-   **Pantalla de Login**: Verifica que el diseño se vea bien y los inputs funcionen.
-   **Dashboard**: Confirma que tras el login, la sesión se mantiene activa.
