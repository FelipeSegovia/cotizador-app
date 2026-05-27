# App de cotización

Esta es una app que permite crear cotizaciones para clientes, con una interfaz sencilla y funcional. La app está construida con React, Vite y TypeScript, y utiliza Tailwind CSS para el diseño.

## Características

- Crear cotizaciones
- Ver un dashboard con métricas y cotizaciones recientes
- Visualizar cotizaciones y ver estado en el que está y previsualización de esta.

## Comandos locales

- `npx tunnelmole <PORT>` - para exponer la app localmente a través de un túnel seguro.
- `pnpm dev` - para iniciar la app en modo desarrollo.
- `pnpm build` - para construir la app para producción.

## Credenciales mock (desarrollo con MSW)

Con `VITE_MSW_ENABLED=true`, puedes probar el módulo de usuarios y el flujo de primer login:

| Rol | Correo | Contraseña | Notas |
|-----|--------|------------|-------|
| Admin | `admin@quoteflow.cl` | `Admin1234!` | Acceso al panel **Usuarios** |
| Usuario | `felipe.segovia.rod@gmail.com` | `Fe.89104665` | Acceso estándar (sin Usuarios) |
| Usuario (primer login) | `rodrigo.vargas@quoteflow.cl` | `TempPass123!` | Debe cambiar contraseña al ingresar |
| Usuario (deshabilitado) | `maria.castro@quoteflow.cl` | `TempPass456!` | Login bloqueado (`403`) |

Al crear o reenviar contraseña provisional, el **correo se simula** (toast en pantalla + log en consola del navegador). El backend real deberá implementar el envío SMTP/API.

## Integración con el backend

Para implementar el API real del módulo de usuarios (contratos, roles, flujos y checklist), ver **[README-BACKEND-INTEGRATION.md](./README-BACKEND-INTEGRATION.md)**.

## Despliegue en Netlify

El sitio se sirve por **HTTPS**. Si `VITE_BASE_URL_API` apunta a `http://...`, el navegador bloquea las peticiones (mixed content).

1. En **Site settings → Environment variables** (producción):
   - `VITE_BASE_URL_API` → **vacío** o elimínala (las llamadas van a `/api/...` del mismo dominio).
   - `VITE_MSW_ENABLED` → `false` o no la definas.
2. El archivo [`netlify.toml`](netlify.toml) hace proxy de `/api/*` al backend (`http://67.205.153.42:3000`). Si cambias de servidor, actualiza la URL `to` en ese archivo.
3. Vuelve a desplegar (**Trigger deploy**) después de cambiar variables.

Si más adelante el API tiene HTTPS propio (dominio + certificado), puedes usar `VITE_BASE_URL_API=https://api.tudominio.com` sin proxy.
