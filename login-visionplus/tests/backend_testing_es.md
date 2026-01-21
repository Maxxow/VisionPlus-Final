# Documentación de Pruebas de Backend

Este documento describe la estrategia de pruebas de carga y funcionales para el backend de VisionPlus.

## Resumen

Hemos implementado scripts para cubrir dos aspectos críticos:
1.  **Pruebas de Carga**: Simulación de 1000 usuarios concurrentes para verificar rendimiento y límites de velocidad.
2.  **Pruebas Funcionales**: Verificación de casos de error (contraseña incorrecta, usuario duplicado) para asegurar la integridad de la seguridad.

## Configuración del Entorno

> [!NOTE]
> **Modo Base de Datos Mock**: Debido a la ausencia de una instancia local de MongoDB, el backend ha sido configurado temporalmente para usar una **base de datos en memoria**. Esto permite ejecutar las pruebas sin depender de una base de datos externa.

### Requisitos
-   Node.js y NPM
-   Python 3
-   Librería `requests` (`pip install requests`)

## Ejecución de las Pruebas

### 1. Iniciar el Backend
Navega al directorio del backend e inicia el servidor:
```bash
cd login-visionplus/backend
npm start
```
Asegúrate de ver el mensaje "Servidor iniciado correctamente".

### 2. Prueba de Carga (Load Test)
Ejecuta el script de carga:
```bash
cd login-visionplus/tests
python3 backend_load_test.py
```
**Resultado Esperado**:
-   El `ThrottlerModule` debe bloquear la mayoría de las peticiones rápidas (~85% de fallos 429 Too Many Requests).
-   Esto confirma que la protección contra ataques DoS está activa.

### 3. Prueba Funcional (Casos Negativos)
Ejecuta el script funcional:
```bash
cd login-visionplus/tests
python3 backend_functional_test.py
```
**Escenarios Cubiertos**:
-   **Registro Duplicado**: Intentar registrar un email ya existente debe devolver error (401/409).
-   **Contaseña Incorrecta**: Intentar login con clave errónea debe devolver 401.
-   **Usuario Inexistente**: Login con email no registrado debe devolver 401.
-   **Contraseña Débil**: Registro con contraseña corta debe devolver 400 (Bad Request).

## Resultados Clave
-   **Seguridad**: El sistema rechaza correctamente credenciales inválidas y protege contra fuerza bruta.
-   **Validación**: Los DTOs validan correctamente el formato de los datos antes de procesarlos.
