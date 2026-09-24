# Spec: Roles, invitaciones y menú por contrato

## Objetivo

Alinear la UI con el contrato de API (`docs/contrato-backend.md` + `docs/openapi.json`): tres roles (`admin`, `business`, `common`), alta de usuarios por invitación, menú y pantallas según permisos, y ficha de empresa editable solo por `business`.

## Requisitos funcionales

- Roles: `admin` | `business` | `common` en sesión, badges y formularios
- Alta de usuarios solo por invitación (`POST /api/invitations`); no `POST /api/users` con contraseña
- Admin invita `business` o `common` eligiendo empresa (`companyId` + `role` obligatorios)
- Business invita solo `common` a su empresa
- Página pública `/invitar?token=...` para aceptar invitación (password + teléfono opcional)
- Menú por rol:
  - **admin**: Empresas, Usuarios, Feedback. Sin Cotizaciones, Clientes ni Gastos. Home: `/dashboard/empresas`
  - **business**: Cotizaciones, Clientes, Gastos, Configuración (editable), Usuarios de su empresa
  - **common**: Cotizaciones, Clientes, Gastos, Configuración (solo lectura)
- Admin lista/crea empresas (`GET/POST /api/companies`) y luego invita dueño `business`
- Configuración: business edita ficha y términos; common solo lectura; admin solo perfil
- Si empresa no configurada: business puede completar; common ve aviso “pide al dueño…”

## Fuera de alcance

- Envío real de correo (backend; MSW simula)
- Recurso Gastos (se deja visible para business/common como está)
- Paginación en servidor
- Cambiar el rol de un admin de plataforma a `common`

## Criterios de aceptación

- [ ] `UserRole` incluye `business` y el login/bootstrap lo reconocen
- [ ] Sidebar y rutas respetan la matriz de acceso del contrato
- [ ] Admin no ve Cotizaciones ni Clientes
- [ ] “Nuevo usuario” es un modal de invitación (sin contraseña)
- [ ] Business puede listar usuarios e invitar collaborators
- [ ] `/invitar?token=` crea cuenta y redirige a login
- [ ] Admin puede listar y crear empresas
- [ ] Common ve ficha/términos en solo lectura
- [ ] MSW cubre invitaciones, companies y tenancy por `companyId`
